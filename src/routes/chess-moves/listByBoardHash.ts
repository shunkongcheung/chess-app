import { Connection } from "typeorm";

import { ChessMove, ChessBoard } from "../../entities";

import getSerializedChessMove from "./getSerializedChessMove";

interface Query {
  board: string;
}

const list = async (connection: Connection, { board }: Query) => {
  const fromBoard = await connection
    .getRepository(ChessBoard)
    .findOneOrFail({ board });

  const [rawData, count] = await connection
    .getRepository(ChessMove)
    .findAndCount({
      where: { fromBoard },
      relations: ["fromBoard", "toBoard"],
      order: { qScore: "DESC" },
    });

  const results = rawData.map(getSerializedChessMove);
  return { count, results };
};

export default list;
