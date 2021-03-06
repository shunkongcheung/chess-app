import { Connection } from "typeorm";

import {
  getAllNextPositions,
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

import { calculateQScore } from "../../utils";

import { choose } from "../chess-ml";

type Board = Array<Array<string>>;

interface Query {
  side: Side;
  board: Board;
  shdUpdateQScores: boolean;
  round: number;
  randomRate: number;
}

const create = async (connection: Connection, query: Query) => {
  let { randomRate, round, board } = query;

  const gameSeries = await connection.transaction(async (entityManager) => {
    await entityManager.getRepository(GameSeries).save({});
    return entityManager
      .createQueryBuilder()
      .select()
      .from(GameSeries, "game_series")
      .orderBy({ id: "DESC" })
      .getRawOne();
  });

  const prevMove = undefined;

  // create boards and moves
  await helper(
    connection,
    board,
    gameSeries,
    round,
    prevMove,
    randomRate,
    query.side
  );

  if (!query.shdUpdateQScores) return gameSeries;

  // calculate move qScores
  const moveSequences = await connection.getRepository(MoveSequence).find({
    relations: ["chessMove", "chessMove.fromBoard", "chessMove.toBoard"],
    where: { gameSeries },
    order: { id: "DESC" },
  });
  await calculateQScore(connection, moveSequences);

  // return series
  return gameSeries;
};

const helper = async (
  connection: Connection,
  board: Board,
  gameSeries: GameSeries,
  round: number,
  prevMove: ChessMove | undefined,
  randomRate: number,
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
  const selectedPos =
    Math.random() < randomRate
      ? moves[Math.floor(moves.length * Math.random())]
      : await choose(connection, { moves, side, board });

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

  await helper(
    connection,
    board,
    gameSeries,
    round,
    chessMove,
    randomRate,
    side
  );
};

export default create;
