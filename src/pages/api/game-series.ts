import { NextApiRequest, NextApiResponse } from "next";
import { list } from "../../routes/game-series";
import { getDbConnection } from "../../utils";

import * as yup from "yup";

/**
 * @swagger
 *
 * tags:
 *   - name: game-series
 *
 * /game-series:
 *   get:
 *     tags: [game-series]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: pageNum
 *         in: query
 *         required: false
 *         type: number
 *         default: 1
 *       - name: pageSize
 *         in: query
 *         required: false
 *         type: number
 *         default: 10
 *     responses:
 *       200:
 *         description: Sample response
 *         schema:
 *           type: object
 *           $ref: '#/components/ListGameSeries'
 *
 */

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const conn = await getDbConnection();

  if (method === "GET") {
    const schema = yup.object({
      pageNum: yup.number().min(1).optional().default(1),
      pageSize: yup.number().min(0).optional().default(10),
    });
    const validated = await schema.validate(req.query);
    const resData = await list(conn, validated);
    res.status(200).json(resData);
  } else {
    return res.status(404).json({ message: "Method not found." });
  }
  // .send({ firstOutput, secondOutput, thirdOutput, netJson, newNetJson });
};
