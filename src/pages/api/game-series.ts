import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

import { create, list } from "../../routes/game-series";
import { getBoardFromHash, getInitialBoard } from "../../chess";
import { getDbConnection } from "../../utils";

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
 *       - name: randomRate
 *         in: formData
 *         required: false
 *         type: number
 *         default: 0.5
 *       - name: board
 *         in: formData
 *         required: false
 *         type: string
 *         description: 2D matrix of string. If not provided, initial board will be used.
 *       - name: round
 *         in: formData
 *         required: false
 *         type: number
 *         default: 10
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
      randomRate: yup.number().max(1).min(0).optional().default(0.5),
      shdTrain: yup.boolean().optional().default(true),
      board: yup.string().optional(),
      round: yup.number().min(1).optional().default(10),
    });
    const { board, ...validated } = await schema.validate(req.body);
    const boardUnhash = board ? getBoardFromHash(board) : getInitialBoard();
    const resData = await create(conn, { ...validated, board: boardUnhash });
    res.status(201).json(resData);
  } else {
    return res.status(404).json({ message: "Method not found." });
  }
};
