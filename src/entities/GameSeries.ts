import { PrimaryGeneratedColumn, Entity, OneToMany } from "typeorm";

import ChessMove from "./ChessMove";

/**
 * @swagger
 *
 * definitions:
 *   GameSeries:
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *       moves:
 *         type: array
 *         items:
 *           $ref: '#/definitions/ChessMove'
 */

@Entity()
class GameSeries {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ChessMove, (moves) => moves.gameSeries)
  moves: Array<ChessMove>;
}

export default GameSeries;
