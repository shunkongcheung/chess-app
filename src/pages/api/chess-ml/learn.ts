import { NextApiRequest, NextApiResponse } from "next";

import { learn } from "../../../routes/chess-ml";
import { getDbConnection } from "../../../utils";

/**
 * @swagger
 *
 * /chess-ml/learn:
 *   post:
 *     tags: [chess-ml]
 *     produces:
 *       - application/json
 *     responses:
 *       204:
 *         description: learning finished
 *
 */

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const conn = await getDbConnection();

  if (method === "POST") {
    await learn(conn);
    return res.status(204).send("");
  } else {
    return res.status(404).json({ message: "Method not found." });
  }
};
