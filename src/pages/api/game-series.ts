import { NextApiRequest, NextApiResponse } from "next";
import { create, list } from "../../routes/game-series";
import { getInitialBoard } from "../../chess";
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
 *         schema:
 *           type: object
 *           $ref: '#/components/ListGameSeries'
 *   post:
 *     tags: [game-series]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             board:
 *               in: body
 *               required: false
 *               type: array
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *               description: 2D matrix of string. If not provided, initial board will be used.
 *             round:
 *               in: formData
 *               required: false
 *               type: number
 *               default: 10
 *     responses:
 *       201:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/GameSeries'
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
  } else if (method === "POST") {
    const schema = yup.object({
      board: yup
        .array()
        .of(yup.array().of(yup.string().required()).required())
        .optional()
        .default(getInitialBoard()),
      round: yup.number().min(1).optional().default(10),
    });
    const validated = await schema.validate(req.body);
    const resData = await create(conn, validated);
    res.status(201).json(resData);
  } else {
    return res.status(404).json({ message: "Method not found." });
  }
};
