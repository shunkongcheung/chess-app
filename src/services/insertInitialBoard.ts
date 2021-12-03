import { Connection } from "typeorm";
import getShortHash from "short-hash";

import { getBoardWinnerAndScore, getInitialBoard } from "../chess";
import { Side } from "../constants";
import { ChessBoard } from "../entities";

const insertInitialBoard = async (conn: Connection) => {
  const board = getInitialBoard();

  const [_, score] = getBoardWinnerAndScore(board);
  const boardStr = board.map((row) => row.join("")).join("");
  const shortHash = getShortHash(boardStr);
  const toBeMovedBy = Side.Bottom;
  await conn
    .createQueryBuilder()
    .insert()
    .into(ChessBoard)
    .values({
      board: boardStr,
      shortHash,
      score,
      toBeMovedBy,
      isMoved: false,
    })
    .orIgnore()
    .execute();

  return conn.getRepository(ChessBoard).findOne({ shortHash });
};

export default insertInitialBoard;
