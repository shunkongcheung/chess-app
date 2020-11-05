import { NextApiRequest, NextApiResponse } from "next";
import { Connection } from "typeorm";

import { Side } from "../../constants";
import { getBoardFromHash, getInitialBoard } from "../../chess";
import { create } from "../../routes/game-series";
import { getDbConnection } from "../../utils";

type Board = Array<Array<string>>;

/**
 * @swagger
 *
 * tags:
 *   - name: Hello
 *     description: Ping and check database connection is okay
 *
 * /temp:
 *   post:
 *     tags: [Hello]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: randomRate
 *         type: number
 *         in: formData
 *         required: true
 *         default: 1
 *         max: 1
 *         min: 0
 *       - name: board
 *         type: string
 *         in: formData
 *         required: false
 *         default: CHJKGKJHC__________A_____A_S_S_S_S_S__________________s_s_s_s_s_a_____a__________chjkgkjhc
 *       - name: round
 *         type: number
 *         in: formData
 *         required: false
 *         default: 1000
 *       - name: depth
 *         type: number
 *         in: formData
 *         required: true
 *         default: 10
 *       - name: side
 *         type: string
 *         enum: [bottom, top]
 *         in: formData
 *         required: true
 *         default: bottom
 *
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             hello:
 *               type: number
 *
 */

const helper = async (
  connection: Connection,
  board: Board,
  side: Side,
  round: number,
  depth: number,
  randomRate: number
) => {
  if (round <= 0) return;

  await create(connection, {
    board,
    randomRate,
    side,
    round: depth,
    shdUpdateQScores: true,
  });
  console.log(`finished round ${round}...`);

  await helper(connection, board, side, round - 1, depth, randomRate);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const conn = await getDbConnection();
  const board = req.body.board
    ? getBoardFromHash(req.body.board)
    : getInitialBoard();
  await helper(
    conn,
    board,
    req.body.side,
    req.body.round,
    req.body.depth,
    req.body.randomRate
  );
  res.status(200).json({ hello: "world" });
};
