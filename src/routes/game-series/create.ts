import { Connection, In } from "typeorm";

import {
  getAllNextPositions,
  getBoardFromHash,
  getBoardWinnerAndScore,
  getHashFromBoard,
  getIsPieceEmpty,
  getMovedBoard,
} from "../../chess";

import { Side } from "../../constants";

import {
  ChessBoard,
  ChessMove,
  GameSeries,
  MoveSequence,
} from "../../entities";

import { choose } from "../chess-ml";

type Board = Array<Array<string>>;

interface Query {
  board: Board;
  round: number;
}

const create = async (connection: Connection, query: Query) => {
  let { round, board } = query;

  const gameSeries = await connection.transaction(async (entityManager) => {
    await entityManager.getRepository(GameSeries).save({});
    return entityManager
      .createQueryBuilder()
      .select()
      .from(GameSeries, "game_series")
      .orderBy({ id: "DESC" })
      .getRawOne();
  });

  const side = Side.Bottom as Side;
  const prevMove = undefined;

  // create boards and moves
  await helper(connection, board, gameSeries, round, prevMove, side);

  // calculate move qScores
  await Promise.all([
    calculateQScores(connection, gameSeries, Side.Bottom),
    calculateQScores(connection, gameSeries, Side.Top),
  ]);

  // return series
  return gameSeries;
};

const helper = async (
  connection: Connection,
  board: Board,
  gameSeries: GameSeries,
  round: number,
  prevMove: ChessMove | undefined,
  side: Side
) => {
  // get current situation
  const [winner, score] = getBoardWinnerAndScore(board);

  // storing board
  const boardHash = getHashFromBoard(board);
  await connection
    .createQueryBuilder()
    .insert()
    .into(ChessBoard)
    .values({
      board: boardHash,
      side: side,
      simpleScore: score,
    })
    .onConflict(`("board") DO NOTHING`)
    .execute();

  const chessBoard = await connection
    .getRepository(ChessBoard)
    .findOne({ board: boardHash });

  if (prevMove) {
    delete prevMove.id;
    const chessMoveData = { ...prevMove, toBoard: chessBoard };
    const chessMove = await connection.transaction(async (entityManager) => {
      await entityManager
        .createQueryBuilder()
        .insert()
        .into(ChessMove)
        .values(chessMoveData)
        .onConflict(
          `("fromBoardId", "fromRow", "fromCol", "toRow", "toCol") DO NOTHING`
        )
        .execute();

      return entityManager.getRepository(ChessMove).findOne({
        where: {
          fromBoard: chessMoveData.fromBoard,
          fromRow: chessMoveData.fromRow,
          fromCol: chessMoveData.fromCol,
          toRow: chessMoveData.toRow,
          toCol: chessMoveData.toCol,
        },
      });
    });

    await connection.transaction((entityManager) =>
      entityManager
        .createQueryBuilder()
        .insert()
        .into(MoveSequence)
        .values({ gameSeries, chessMove, side: chessMoveData.side })
        .execute()
    );
  }

  // if someone won or reached end
  if (!getIsPieceEmpty(winner) || round <= 0) return;

  // get all possible position
  const moves = getAllNextPositions(board, side === Side.Top);
  const selectedPos = await choose(connection, { moves, side, board });

  // storing moves
  const chessMove = new ChessMove();
  chessMove.toCol = selectedPos.to[1];
  chessMove.toRow = selectedPos.to[0];
  chessMove.toPiece = board[selectedPos.to[0]][selectedPos.to[1]];

  chessMove.fromCol = selectedPos.from[1];
  chessMove.fromRow = selectedPos.from[0];
  chessMove.fromPiece = board[selectedPos.from[0]][selectedPos.from[1]];

  chessMove.fromBoard = chessBoard;
  chessMove.side = side;
  chessMove.qScore = 0; // no value for now

  // proceed to next round
  board = getMovedBoard(board, selectedPos.from, selectedPos.to);
  side = side === Side.Top ? Side.Bottom : Side.Top;
  round--;

  await helper(connection, board, gameSeries, round, chessMove, side);
};

const calculateQScores = async (
  connection: Connection,
  gameSeries: GameSeries,
  side: Side
) => {
  const [ALPHA, GAMMA] = [0.1, 0.8];

  const moveSequences = await connection.getRepository(MoveSequence).find({
    relations: ["chessMove", "chessMove.fromBoard"],
    where: { side, gameSeries },
    order: { id: "DESC" },
  });
  const isUpperSide = side === Side.Top;

  const updatedChessMoves = await Promise.all(
    moveSequences.map(async (moveSequence) => {
      const { chessMove } = moveSequence;

      const board = getBoardFromHash(chessMove.fromBoard.board);
      const moves = getAllNextPositions(board, isUpperSide);
      const boards = moves.map((mv) =>
        getHashFromBoard(getMovedBoard(board, mv.from, mv.to))
      );

      const chessBoards = await connection
        .getRepository(ChessBoard)
        .find({ board: In(boards) });

      const opponantChessMoves = await connection
        .getRepository(ChessMove)
        .createQueryBuilder("chessmove")
        .leftJoinAndSelect("chessmove.fromBoard", "fromBoard")
        .where(
          `"fromBoard"."id" IN (${chessBoards.map((itm) => itm.id).join(",")})`
        )
        .getMany();

      const scores = opponantChessMoves.length
        ? opponantChessMoves.map((chessMove) => chessMove.qScore)
        : [0];

      const optimalFutureReward = isUpperSide
        ? Math.max(...scores)
        : Math.min(...scores);

      if (isUpperSide)
        console.log({
          chessMove,
          boards,
          scores,
          opponantChessMoves,
          optimalFutureReward,
        });

      const { qScore: oQScore } = chessMove;
      const reward = chessMove.fromBoard.simpleScore;
      const addValue = ALPHA * (reward + GAMMA * optimalFutureReward - oQScore);
      chessMove.qScore += addValue;

      return chessMove;
    })
  );

  return connection.getRepository(ChessMove).save(updatedChessMoves);
};

export default create;
