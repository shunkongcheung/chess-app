import { NextApiRequest, NextApiResponse } from "next";
import { Connection } from "typeorm";
import * as yup from "yup";
import moment from "moment";

import { Side } from "../../constants";
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
 *         required: false
 *         min: 1
 *         description: repeat from this start board for # of times
 *       - name: till
 *         type: datetime
 *         in: formData
 *         required: false
 *         min: 1
 *         description: repeat until this time
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
interface Query {
  side: Side;
  steps: number;
  board?: string;
}

const runRound = async (conn: Connection, countDown: number, query: Query) => {
  const { id } = await chessdb(conn, query);
  console.log(`Run as round: ${countDown} remaining. ${id} created.`);
  if (countDown - 1 > 0) return runRound(conn, countDown - 1, query);
  else console.log("Run as round finished");
};

const runTill = async (conn: Connection, till: Date, query: Query) => {
  const current = moment();
  const timer = moment(till).format("MM-DD HH:mm");
  if (moment(current).isBefore(moment(till))) {
    const start = moment().format("MM-DD HH:mm");
    const { id } = await chessdb(conn, query);
    console.log(`Run until: ${start} ${timer} remaining. ${id} created.`);

    return runTill(conn, till, query);
  } else console.log(`Run until ${timer} finished`);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const conn = await getDbConnection();

  if (method === "POST") {
    const schema = yup.object({
      side: yup.string().oneOf(Object.values(Side)).required(),
      steps: yup.number().min(1).required(),
      round: yup.number().min(1).optional(),
      till: yup.date().optional(),
      board: yup.string().optional(),
    });
    const { round, till, ...query } = await schema.validate(req.body);

    if (round) runRound(conn, round, query);
    else if (till) runTill(conn, till, query);
    else await chessdb(conn, query);

    return res.status(200).json(query);
  } else {
    return res.status(404).json({ message: "Method not found." });
  }

  res.status(200).json({ hello: "world" });
};
