import { Connection } from "typeorm";

import { Piece } from "../../constants";
import { ChessBoard, ChessMove } from "../../entities";
import { Board, Position } from "../../types";

interface Move {
  from: Position;
  to: Position;
  board: Board;
}

const insertChessMoves = async (
  conn: Connection,
  moves: Array<Move>,
  chessBoards: Array<ChessBoard>,
  unmovedChessBoard: ChessBoard,
  unmovedBoard: Board
) => {
  const moveWithChessBoards = moves.map((move) => {
    const boardStr = move.board.map((row) => row.join("")).join("");
    return {
      fromRow: move.from[0],
      fromCol: move.from[1],
      fromPiece: unmovedBoard[move.from[0]][
        move.from[1]
      ].toUpperCase() as Piece,
      toRow: move.to[0],
      toCol: move.to[1],
      toPiece: unmovedBoard[move.to[0]][move.to[1]].toUpperCase() as Piece,
      fromBoard: unmovedChessBoard,
      toBoard: chessBoards.find((itm) => itm.board === boardStr),
      movedBy: unmovedChessBoard.toBeMovedBy,
      qScore: 0,
    };
  });

  // insert into ChessMove
  await conn
    .createQueryBuilder()
    .insert()
    .into(ChessMove)
    .values(moveWithChessBoards)
    .orIgnore()
    .execute();
};

export default insertChessMoves;
