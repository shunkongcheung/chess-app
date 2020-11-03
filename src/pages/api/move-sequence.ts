import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

import { list } from "../../routes/move-sequence";
import { getDbConnection } from "../../utils";

/**
 * @swagger
 *
 * tags:
 *   - name: move-sequence
 *
 * /move-sequence:
 *   get:
 *     tags: [move-sequence]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: gameSeries
 *         in: query
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/components/ListMoveSequence'
 *
 */

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const conn = await getDbConnection();

  if (method === "GET") {
    const schema = yup.object({
      gameSeries: yup.number().required(),
    });
    const validated = await schema.validate(req.query);
    const resData = await list(conn, validated);
    res.status(200).json(resData);
  } else {
    return res.status(404).json({ message: "Method not found." });
  }
};
