import { Connection } from "typeorm";
import brain from "brain.js";

import { ChessMlModel } from "../../entities";
import { Side } from "../../constants";

type Board = Array<Array<string>>;

type Position = [number, number];

interface Move {
  from: Position;
  to: Position;
}

interface Query {
  board: Board;
  side: Side;
  moves: Array<Move>;
}

/**
 * @swagger
 *
 * components:
 *   ChooseChessMl:
 *     type: object
 *     properties:
 *       from:
 *         type: array
 *         items:
 *           type: number
 *       to:
 *         type: array
 *         items:
 *           type: number
 *
 */

const choose = async (connection: Connection, query: Query): Promise<Move> => {
  const { side, board, moves } = query;
  const chessMlModel = await connection
    .getRepository(ChessMlModel)
    .findOne({ side });

  if (!chessMlModel) {
    console.warn("No model trained yet. Return randomly");
    // return moves[Math.floor(Math.random() * moves.length)];
    return moves[0];
  }
  const { netModel } = chessMlModel;

  const net = new brain.NeuralNetwork();
  net.fromJSON(JSON.parse(netModel));

  const scoredMoves = moves.map((move) => ({
    score: net.run({ board, move }) as number,
    move,
  }));

  scoredMoves.sort((a, b) => a.score - b.score);

  if (side === Side.Top) return scoredMoves[scoredMoves.length - 1].move;
  else return scoredMoves[0].move;
};

export default choose;
