import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  Unique,
} from "typeorm";
import { Side } from "../constants";
import ChessBoard from "./ChessBoard";

/**
 * @swagger
 *
 * definitions:
 *   ChessMove:
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *       fromRow:
 *         type: number
 *       fromCol:
 *         type: number
 *       fromPiece:
 *         type: string
 *       toRow:
 *         type: number
 *       toCol:
 *         type: number
 *       toPiece:
 *         type: string
 *       fromBoard:
 *         $ref: '#/definitions/ChessBoard'
 *       toBoard:
 *         $ref: '#/definitions/ChessBoard'
 *       side:
 *         $ref: '#/components/Side'
 *       qSroce:
 *         type: number
 */

@Unique("envAndAct", ["fromBoard", "fromRow", "fromCol", "toRow", "toCol"])
@Entity()
class ChessMove {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer" })
  fromRow: number;

  @Column({ type: "integer" })
  fromCol: number;

  @Column()
  fromPiece: string;

  @Column({ type: "integer" })
  toRow: number;

  @Column({ type: "integer" })
  toCol: number;

  @Column()
  toPiece: string;

  @ManyToOne(() => ChessBoard, { onDelete: "CASCADE" })
  fromBoard: ChessBoard;

  @ManyToOne(() => ChessBoard, { onDelete: "CASCADE" })
  toBoard: ChessBoard;

  @Column({ type: "integer" })
  qScore: number;

  @Column({ type: "enum", enum: Object.values(Side) })
  side: Side;
}

export default ChessMove;
