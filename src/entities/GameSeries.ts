import {Column, PrimaryGeneratedColumn, Entity, OneToMany } from "typeorm";

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

	@Column({default: true})
	botPlayerIsComp:boolean;

	@Column({default: true})
	topPlayerIsComp:boolean;

  @OneToMany(() => MoveSequence, (moveSequence) => moveSequence.gameSeries)
  moveSequences: Array<MoveSequence>;
}

export default GameSeries;
