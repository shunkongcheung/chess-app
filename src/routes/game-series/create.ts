import { Connection } from "typeorm";

import {
  getAllNextPositions,
  getBoardWinnerAndScore,
  getHashFromBoard,
  getIsPieceEmpty,
  getMovedBoard,
} from "../../chess";
import { Side } from "../../constants";
import { ChessBoard, ChessMove, GameSeries } from "../../entities";

type Board = Array<Array<string>>;

interface Query {
  board: Board;
  round: number;
}

const create = async (connection: Connection, query: Query) => {
  let { round, board } = query;

  const gameSeries = await connection.getRepository(GameSeries).save({});
  const side = Side.Bottom as Side;
  const prevMove = undefined;
  await helper(connection, board, gameSeries, round, prevMove, side);

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
  const chessBoard = await connection.getRepository(ChessBoard).save({
    board: getHashFromBoard(board),
    side: side,
    simpleScore: score,
  });

  if (prevMove) {
    await connection
      .getRepository(ChessMove)
      .save({ ...prevMove, toBoard: chessBoard });
  }

  // if someone won or reached end
  if (!getIsPieceEmpty(winner) || round <= 0) return;

  // get all possible position
  const positions = getAllNextPositions(board, side === Side.Top);

  // randomly choose a board to move
  // TODO:
  // choose from trained model
  const posIdx = Math.floor(Math.random() * positions.length);
  const selectedPos = positions[posIdx];

  // storing moves
  const chessMove = new ChessMove();
  chessMove.toCol = selectedPos.to[1];
  chessMove.toRow = selectedPos.to[0];
  chessMove.toPiece = board[selectedPos.to[0]][selectedPos.to[1]];

  chessMove.fromCol = selectedPos.from[1];
  chessMove.fromRow = selectedPos.from[0];
  chessMove.fromPiece = board[selectedPos.from[0]][selectedPos.from[1]];

  chessMove.fromBoard = chessBoard;
  chessMove.gameSeries = gameSeries;
  chessMove.side = side;
  chessMove.qScore = 0; // no value for now

  // proceed to next round
  board = getMovedBoard(board, selectedPos.from, selectedPos.to);
  side = side === Side.Top ? Side.Bottom : Side.Top;
  round--;

  await helper(connection, board, gameSeries, round, chessMove, side);
};

export default create;
