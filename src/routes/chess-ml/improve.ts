import { Connection } from "typeorm";

import { Side } from "../../constants";

import {
  getBoardFromHash,
  getHashFromBoard,
  getMovedBoard,
  getBoardWinnerAndScore,
} from "../../chess";

import {
  ChessBoard,
  ChessMove,
  GameSeries,
  MoveSequence,
} from "../../entities";

import { calculateQScore } from "../../utils";

type Board = Array<Array<string>>;

type Position = [number, number];

interface Move {
  from: Position;
  to: Position;
}

interface Query {
  botPlayerIsComp: boolean;
  topPlayerIsComp: boolean;
  startBoard: Board;
  moves: Array<Move>;
}

const improve = async (connection: Connection, query: Query) => {
  const { botPlayerIsComp, topPlayerIsComp, startBoard, moves } = query;

  // create board for all moves
  const chessBoardValues = getChessBoards(startBoard, moves);
  await connection
    .createQueryBuilder()
    .insert()
    .into(ChessBoard)
    .values(chessBoardValues)
    .onConflict(`DO NOTHING`)
    .execute();

  const chessBoardRepo = connection.getRepository(ChessBoard);
  const chessBoards = await Promise.all(
    chessBoardValues.map((chessBoard) =>
      chessBoardRepo.findOne({ board: chessBoard.board })
    )
  );

  // create chess moves
  const chessMoveValues = getChessMoves(chessBoards, moves);
  await connection
    .createQueryBuilder()
    .insert()
    .into(ChessMove)
    .values(chessMoveValues)
    .onConflict(`DO NOTHING`)
    .execute();

  const chessMoveRepo = connection.getRepository(ChessMove);
  const chessMoves = await Promise.all(
    chessMoveValues.map((chessMove) =>
      chessMoveRepo.findOne({
        fromBoard: chessMove.fromBoard,
        toBoard: chessMove.toBoard,
      })
    )
  );

  // create game series
  const gameSeries = await connection.getRepository(GameSeries).save({
    botPlayerIsComp,
    topPlayerIsComp,
  });

  // create move sequence
  const moveSequenceValues = getMoveSequences(gameSeries, chessMoves);
  await connection.getRepository(MoveSequence).save(moveSequenceValues);

  const moveSequenceRepo = connection.getRepository(MoveSequence);
  const moveSequences = await Promise.all(
    moveSequenceValues.map((moveSequence) =>
      moveSequenceRepo.findOne({
        relations: ["chessMove", "chessMove.fromBoard", "chessMove.toBoard"],
        where: {
          gameSeries: gameSeries,
          chessMove: moveSequence.chessMove,
        },
      })
    )
  );

  calculateQScore(connection, moveSequences);

  return { id: gameSeries.id };
};

const getChessBoards = (board: Board, moves: Array<Move>) => {
  const boards = [
    {
      board: getHashFromBoard(board),
      simpleScore: getBoardWinnerAndScore(board)[1],
    },
  ];

  moves.map((move) => {
    board = getMovedBoard(board, move.from, move.to);
    boards.push({
      board: getHashFromBoard(board),
      simpleScore: getBoardWinnerAndScore(board)[1],
    });
  });

  return boards;
};

const getChessMoves = (boards: Array<ChessBoard>, moves: Array<Move>) => {
  return moves.map((move: Move, idx: number) => {
    const fromBoard = boards[idx];
    const toBoard = boards[idx + 1];
    const fromPiece = getBoardFromHash(fromBoard.board)[move.from[0]][
      move.from[1]
    ];
    return {
      fromRow: move.from[0],
      fromCol: move.from[1],
      fromPiece,
      toRow: move.to[0],
      toCol: move.to[1],
      toPiece: getBoardFromHash(toBoard.board)[move.to[0]][move.to[1]],
      fromBoard,
      toBoard,
      qScore: 0,
      side: fromPiece.toUpperCase() === fromPiece ? Side.Top : Side.Bottom,
    };
  });
};

const getMoveSequences = (
  gameSeries: GameSeries,
  chessMoves: Array<ChessMove>
) => {
  return chessMoves.map((chessMove: ChessMove) => ({
    gameSeries,
    chessMove,
    side: chessMove.side,
  }));
};

export default improve;
