import { PrimaryGeneratedColumn, Entity, OneToMany } from "typeorm";

import MoveSequence from "./MoveSequence";

/**
 * @swagger
 *
 * definitions:
 *   GameSeries:
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *       moveSequences:
 *         type: array
 *         items:
 *           $ref: '#/definitions/MoveSequence'
 */

@Entity()
class GameSeries {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => MoveSequence, (moveSequence) => moveSequence.gameSeries)
  moveSequences: Array<MoveSequence>;
}

export default GameSeries;
