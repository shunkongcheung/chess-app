import { Connection } from "typeorm";

import { Side } from "../../constants";
import {
  getAllNextPositions,
  getBoardFromHash,
  getMovedBoard,
} from "../../chess";
import { ChessBoard } from "../../entities";

import getFirstNotMovedBoard from "./getFirstNotMovedBoard";
import insertChessBoards from "./insertChessBoards";
import insertChessMoves from "./insertChessMoves";

const insertNextBoardsAndMoves = async (conn: Connection) => {
  // get an unmoved board
  const unmovedChessBoard = await getFirstNotMovedBoard(conn);
  const unmovedBoard = getBoardFromHash(unmovedChessBoard.board);
  const isTopSide = unmovedChessBoard.toBeMovedBy === Side.Top;

  // calculate all moves
  const moves = getAllNextPositions(unmovedBoard, isTopSide).map((move) => {
    const board = getMovedBoard(unmovedBoard, move.from, move.to);
    return { from: move.from, to: move.to, board };
  });

  // create chess boards
  const chessBoards = await insertChessBoards(
    conn,
    moves.map((itm) => itm.board),
    isTopSide ? Side.Bottom : Side.Top
  );

  // create chess moves
  await insertChessMoves(
    conn,
    moves,
    chessBoards,
    unmovedChessBoard,
    unmovedBoard
  );

  // update unmovedChessBoard to isMoved
  unmovedChessBoard.isMoved = true;
  await conn.getRepository(ChessBoard).save(unmovedChessBoard);

  return {
    from: unmovedChessBoard,
    to: chessBoards,
  };
};

export default insertNextBoardsAndMoves;
