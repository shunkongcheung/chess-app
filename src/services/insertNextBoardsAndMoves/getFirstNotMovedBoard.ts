import { Connection } from "typeorm";

import { ChessBoard } from "../../entities";

const getFirstNotMovedBoard = async (conn: Connection) => {
  const results = await conn
    .getRepository(ChessBoard)
    .find({ where: { isMoved: false }, take: 1 });

  return results[0];
};

export default getFirstNotMovedBoard;
