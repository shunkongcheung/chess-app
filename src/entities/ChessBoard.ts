import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";
import { Side } from "../constants";

/**
 * @swagger
 *
 * definitions:
 *   ChessBoard:
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *       board:
 *         type: string
 *       side:
 *         $ref: '#/components/Side'
 *       simpleScore:
 *         type: number
 */

@Entity()
class ChessBoard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  board: string;

  @Column({ type: "enum", enum: Object.values(Side) })
  side: Side;

  @Column({ type: "integer" })
  simpleScore: number;
}

export default ChessBoard;
