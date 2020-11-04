import { Column, PrimaryGeneratedColumn, Entity, ManyToOne } from "typeorm";
import { Side } from "../constants";
import ChessMove from "./ChessMove";
import GameSeries from "./GameSeries";

/**
 * @swagger
 *
 * definitions:
 *   MoveSequence:
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *       gameSeries:
 *         $ref: '#/definitions/GameSeries'
 *       chessMove:
 *         $ref: '#/definitions/ChessMove'
 *       side:
 *         $ref: '#/components/Side'
 */

@Entity()
class MoveSequence {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GameSeries, (gameSeries) => gameSeries.moveSequences, {
    onDelete: "CASCADE",
  })
  gameSeries: GameSeries;

  @ManyToOne(() => ChessMove, {
    onDelete: "CASCADE",
  })
  chessMove: ChessMove;

  @Column({ type: "enum", enum: Object.values(Side) })
  side: Side;
}

export default MoveSequence;
