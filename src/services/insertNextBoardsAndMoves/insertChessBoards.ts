import { Connection, In } from "typeorm";
import getShortHash from "short-hash";

import { getBoardWinnerAndScore } from "../../chess";
import { Side } from "../../constants";
import { ChessBoard } from "../../entities";
import { Board } from "../../types";

const insertChessBoards = async (
  conn: Connection,
  boards: Array<Board>,
  toBeMovedBy: Side
) => {
  const values = boards.map((board: Board) => {
    const boardStr = board.map((row) => row.join("")).join("");
    const [_, score] = getBoardWinnerAndScore(board);
    const shortHash = getShortHash(boardStr);
    const isMoved = false;
    return { shortHash, board: boardStr, score, toBeMovedBy, isMoved };
  });

  await conn
    .createQueryBuilder()
    .insert()
    .into(ChessBoard)
    .values(values)
    .orIgnore()
    .execute();

  return conn
    .getRepository(ChessBoard)
    .find({ shortHash: In(values.map((itm) => itm.shortHash)) });
};

export default insertChessBoards;
