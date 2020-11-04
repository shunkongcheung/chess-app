import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

import { getAllNextPositions } from "../../../chess";
import { Side } from "../../../constants";
import { choose } from "../../../routes/chess-ml";
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
 * /chess-ml/choose:
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
 *             side:
 *               in: body
 *               required: true
 *               type: string
 *               $ref: '#/components/Side'
 *             moves:
 *               in: body
 *               required: false
 *               type: array
 *               description: if not provided, all options will be used
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
 *             board:
 *               in: body
 *               required: true
 *               type: array
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         schema:
 *           type: object
 *           properties:
 *             from:
 *               type: array
 *               items:
 *                 type: number
 *             to:
 *               type: array
 *               items:
 *                 type: number
 *
 */

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const conn = await getDbConnection();

  if (method === "POST") {
    const schema = yup.object({
      side: yup.string().oneOf(Object.values(Side)).required(),
      board: yup
        .array()
        .of(yup.array().of(yup.string().required()).required())
        .required(),
      moves: yup
        .array()
        .of(
          yup
            .object({
              from: yup.array().of(yup.number().min(2).max(2).required()),
              to: yup.array().of(yup.number().min(2).max(2).required()),
            })
            .required()
        )
        .optional(),
    });
    const { moves, ...validated } = await schema.validate(req.body);
    const castedMoves = moves
      ? (moves as Array<Move>)
      : getAllNextPositions(validated.board, validated.side === Side.Top);
    const results = await choose(conn, { ...validated, moves: castedMoves });
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message: "Method not found." });
  }
};
