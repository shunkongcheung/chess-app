import { NextApiRequest, NextApiResponse } from "next";
import { Connection } from "typeorm";
import * as yup from "yup";

import { getBoardFromHash } from "../../chess";
import { Side } from "../../constants";
import { ChessBoard } from "../../entities";
import chessdb from "../../routes/chessdb";
import { getDbConnection } from "../../utils";

/**
 * @swagger
 *
 * tags:
 *   - name: Hello
 *     description: Ping and check database connection is okay
 *
 * /hello:
 *   post:
 *     tags: [Hello]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: side
 *         type: string
 *         enum: [bottom, top]
 *         in: formData
 *         required: true
 *         default: bottom
 *       - name: steps
 *         type: number
 *         in: formData
 *         required: true
 *         default: 50
 *         min: 1
 *         max: 100
 *       - name: round
 *         type: number
 *         in: formData
 *         required: true
 *         default: 20
 *         min: 1
 *         max: 50
 *         description: repeat from this start board for # of times
 *       - name: board
 *         type: string
 *         in: formData
 *         required: false
 *         default: CHJKGKJHC__________A_____A_S_S_S_S_S__________________s_s_s_s_s_a_____a__________chjkgkjhc
 *         description: if not provided, choose a random board from database
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *
 */

const getBoard = async (conn: Connection, boardHash?: string) => {
  if (boardHash) return getBoardFromHash(boardHash);
  const chessBoardRepo = conn.getRepository(ChessBoard);

  const count = await chessBoardRepo.count();
  const skip = Math.floor(Math.random() * count);
  const chessBoard = await chessBoardRepo.find({ skip, take: 1 })[0];
  return getBoardFromHash(chessBoard.board);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const conn = await getDbConnection();

  if (method === "POST") {
    const schema = yup.object({
      side: yup.string().oneOf(Object.values(Side)).required(),
      steps: yup.number().min(1).max(100).required(),
      round: yup.number().min(1).max(50).required(),
      board: yup.string().optional(),
    });
    const query = await schema.validate(req.body);
    const { board: boardHash } = query;
    const board = await getBoard(conn, boardHash);
    await chessdb(conn, { ...query, board });
    return res.status(200).json({ ...query, board });
  } else {
    return res.status(404).json({ message: "Method not found." });
  }

  res.status(200).json({ hello: "world" });
};
