import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

import { getInitialBoard } from "../../../chess";
import { improve } from "../../../routes/chess-ml";
import { getDbConnection } from "../../../utils";

type Position = [number, number];

interface Move {
  from: Position;
  to: Position;
}

// board, side, moves

/**
 * @swagger
 *
 * /chess-ml/improve:
 *   post:
 *     tags: [chess-ml]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             botPlayerIsComp:
 *               in: body
 *               required: true
 *               type: boolean
 *             topPlayerIsComp:
 *               in: body
 *               required: true
 *               type: boolean
 *             startBoard:
 *               in: body
 *               required: false
 *               description: assume to be full board, if not provided
 *               type: array
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *             moves:
 *               in: body
 *               required: true
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   from:
 *                     type: array
 *                     items:
 *                       type: number
 *                   to:
 *                     type: array
 *                     items:
 *                       type: number
 *     responses:
 *       201:
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *
 */

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const conn = await getDbConnection();

  if (method === "POST") {
    const schema = yup.object({
      topPlayerIsComp: yup.boolean().required(),
      botPlayerIsComp: yup.boolean().required(),
      startBoard: yup
        .array()
        .of(yup.array().of(yup.string().required()).required())
        .optional()
        .default(getInitialBoard()),
      moves: yup
        .array()
        .of(
          yup
            .object({
              from: yup.array().of(yup.number()).min(2).max(2).required(),
              to: yup.array().of(yup.number()).min(2).max(2).required(),
            })
            .required()
        )
        .required(),
    });
    const { moves, ...validated } = await schema.validate(req.body);
    const castedMoves = moves as Array<Move>;
    const results = await improve(conn, { ...validated, moves: castedMoves });
    return res.status(201).json(results);
  } else {
    return res.status(404).json({ message: "Method not found." });
  }
};
