import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

import { listByBoardHash, listByGameSeries } from "../../routes/chess-moves";
import { getDbConnection } from "../../utils";

/**
 * @swagger
 *
 * tags:
 *   - name: move-sequence
 *
 * components:
 *   ListChessMoves:
 *     type: object
 *     properties:
 *       count:
 *         type: number
 *       results:
 *         type: array
 *         items:
 *           $ref: '#/components/SerializedChessMove'
 *
 * /move-sequence:
 *   get:
 *     tags: [move-sequence]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: gameSeries
 *         in: query
 *         required: false
 *         type: number
 *       - name: board
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/components/ListChessMoves'
 *
 */

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const conn = await getDbConnection();

  if (method === "GET") {
    const schema = yup.object({
      gameSeries: yup.number().optional(),
      board: yup.string().optional(),
    });
    const { gameSeries, board } = await schema.validate(req.query);
    if (gameSeries) {
      const resData = await listByGameSeries(conn, { gameSeries });
      res.status(200).json(resData);
    } else if (board) {
      const resData = await listByBoardHash(conn, { board });
      res.status(200).json(resData);
    } else {
      res
        .status(400)
        .json({ message: "One of the query parameter must be provided" });
    }
  } else {
    return res.status(404).json({ message: "Method not found." });
  }
};
