import { Connection } from "typeorm";
import getShortHash from "short-hash";

import { getBoardWinnerAndScore } from "../chess";
import { Side } from "../constants";
import { ChessBoard } from "../entities";
import { Board } from "../types";

const insertChessBoards = async (
  conn: Connection,
  boards: Array<Board>,
  toBeMovedBy: Side
) => {
  const values = boards.map((board: Board) => {
    const boardStr = board.map((row) => row.join("")).join();
    const [_, score] = getBoardWinnerAndScore(board);
    const shortHash = getShortHash(boardStr);
    return { shortHash, board: boardStr, score, toBeMovedBy };
  });

  await conn
    .createQueryBuilder()
    .insert()
    .into(ChessBoard)
    .values(values)
    .orIgnore()
    .execute();
};

export default insertChessBoards;
