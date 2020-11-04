import { Connection } from "typeorm";
import { MoveSequence, GameSeries } from "../../entities";

import getSerializedChessMove from "./getSerializedChessMove";

interface Query {
  gameSeries: number;
}

const list = async (connection: Connection, query: Query) => {
  const gameSeries = await connection
    .getRepository(GameSeries)
    .findOne(query.gameSeries);

  const [rawData, count] = await connection
    .getRepository(MoveSequence)
    .findAndCount({
      where: { gameSeries },
      relations: ["chessMove", "chessMove.fromBoard", "chessMove.toBoard"],
      order: { id: "ASC" },
    });

  const results = rawData.map(({ chessMove }) =>
    getSerializedChessMove(chessMove)
  );

  return { count, results };
};

export default list;
