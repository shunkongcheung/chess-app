import { NextApiRequest, NextApiResponse } from "next";
import { MoreThan, LessThan, Connection } from "typeorm";
import * as yup from "yup";

import { getBoardFromHash } from "../../chess";
import { Side } from "../../constants";
import { ChessMove } from "../../entities";
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
 *       - name: round
 *         type: number
 *         in: formData
 *         required: true
 *         default: 20
 *         min: 1
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

const getBoard = async (conn: Connection, side: Side, boardHash?: string) => {
  if (boardHash) return getBoardFromHash(boardHash);

  const chessMoveRepo = conn.getRepository(ChessMove);
  const chessMoves = await chessMoveRepo.find({
    relations: ["fromBoard"],
    where: [
      { qScore: MoreThan(100), side },
      { qScore: LessThan(-100), side },
    ],
    take: 100,
  });
  if (chessMoves.length) {
    // try updating move that are higher than 100
    // should have a lot of them in production database
    const index = Math.floor(Math.random() * chessMoves.length);
    const chessMove = chessMoves[index];
    return getBoardFromHash(chessMove.fromBoard.board);
  } else {
    // if none exist
    const chessMoves = await chessMoveRepo.find({
      relations: ["fromBoard"],
      where: { side },
    });
    const index = Math.floor(Math.random() * chessMoves.length);
    return getBoardFromHash(chessMoves[index].fromBoard.board);
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const conn = await getDbConnection();

  if (method === "POST") {
    const schema = yup.object({
      side: yup.string().oneOf(Object.values(Side)).required(),
      steps: yup.number().min(1).required(),
      round: yup.number().min(1).required(),
      board: yup.string().optional(),
    });
    const query = await schema.validate(req.body);
    const { round, board: boardHash } = query;
    await Promise.all(
      Array.from({ length: round }).map(async () => {
        const board = await getBoard(conn, query.side, boardHash);
        await chessdb(conn, { ...query, board });
      })
    );
    return res.status(200).json(query);
  } else {
    return res.status(404).json({ message: "Method not found." });
  }

  res.status(200).json({ hello: "world" });
};
