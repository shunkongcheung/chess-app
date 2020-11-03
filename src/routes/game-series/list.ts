import { Connection } from "typeorm";
import { GameSeries } from "../../entities";

/**
 * @swagger
 *
 * components:
 *   ListGameSeries:
 *     type: object
 *     properties:
 *       count:
 *         type: number
 *       results:
 *         type: array
 *         items:
 *           $ref: '#/definitions/GameSeries'
 *
 */

interface Query {
  pageSize: number;
  pageNum: number;
}

const list = async (connection: Connection, query: Query) => {
  const [results, count] = await connection
    .getRepository(GameSeries)
    .findAndCount({
      order: { id: "DESC" },
      skip: (query.pageNum - 1) * query.pageSize,
      take: query.pageSize,
    });

  return { count, results };
};

export default list;
