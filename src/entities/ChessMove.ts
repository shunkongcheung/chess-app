import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  Unique,
} from "typeorm";
import { Piece, Side } from "../constants";
import ChessBoard from "./ChessBoard";

@Unique("envAndAct", ["fromBoard", "fromRow", "fromCol", "toRow", "toCol"])
@Entity()
class ChessMove {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * movement information
   */
  @Column({ type: "integer" })
  fromRow: number;

  @Column({ type: "integer" })
  fromCol: number;

  @Column({ type: "enum", enum: Object.values(Piece) })
  fromPiece: Piece;

  @Column({ type: "integer" })
  toRow: number;

  @Column({ type: "integer" })
  toCol: number;

  @Column({ type: "enum", enum: Object.values(Piece) })
  toPiece: Piece;

  @ManyToOne(() => ChessBoard, { onDelete: "CASCADE" })
  fromBoard: ChessBoard;

  @ManyToOne(() => ChessBoard, { onDelete: "CASCADE" })
  toBoard: ChessBoard;

  /**
   * calculated scores
   */
  @Column({ type: "enum", enum: Object.values(Side) })
  movedBy: Side;

  @Column({ type: "integer" })
  qScore: number;
}

export default ChessMove;
