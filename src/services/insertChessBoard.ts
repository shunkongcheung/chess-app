import { Connection } from "typeorm";
import getShortHash from "short-hash";

import { getBoardWinnerAndScore } from "../chess";
import { ChessBoard } from "../entities";
import { Board } from "../types";

const insertChessBoard = async (conn: Connection, board: Board) => {
  const boardStr = board.map((row) => row.join("")).join();
  const [_, boardScore] = getBoardWinnerAndScore(board);

  const chessBoard = await conn
    .createQueryBuilder()
    .insert()
    .into(ChessBoard)
    .values({
      shortHash: getShortHash(boardStr),
      board: boardStr,
      boardScore,
      expectedScore: 0, // indicate it is not calculated
    })
    .orIgnore()
    .execute();

  return chessBoard;
};

export default insertChessBoard;
