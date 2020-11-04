import { NextApiRequest, NextApiResponse } from "next";
import { getDbConnection } from "../../utils";

// import brain from "brain.js";

/**
 * @swagger
 *
 * tags:
 *   - name: Hello
 *     description: Ping and check database connection is okay
 *
 * /hello:
 *   get:
 *     tags: [Hello]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             hello:
 *               type: number
 *
 */

export default async (_: NextApiRequest, res: NextApiResponse) => {
  await getDbConnection();
  res.status(200).json({ hello: "world" });
};
