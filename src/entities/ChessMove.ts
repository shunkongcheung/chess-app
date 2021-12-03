import { Field, ObjectType } from "type-graphql";
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  Unique,
} from "typeorm";
import { Piece, Side } from "../constants";
import ChessBoard from "./ChessBoard";

@ObjectType()
@Unique("envAndAct", ["fromBoard", "fromRow", "fromCol", "toRow", "toCol"])
@Entity()
class ChessMove {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * movement information
   */
  @Field()
  @Column({ type: "integer" })
  fromRow: number;

  @Field()
  @Column({ type: "integer" })
  fromCol: number;

  @Field()
  @Column({ type: "enum", enum: Object.values(Piece) })
  fromPiece: Piece;

  @Field()
  @Column({ type: "integer" })
  toRow: number;

  @Field()
  @Column({ type: "integer" })
  toCol: number;

  @Field()
  @Column({ type: "enum", enum: Object.values(Piece) })
  toPiece: Piece;

  @Field()
  @ManyToOne(() => ChessBoard, { onDelete: "CASCADE" })
  fromBoard: ChessBoard;

  @Field()
  @ManyToOne(() => ChessBoard, { onDelete: "CASCADE" })
  toBoard: ChessBoard;

  /**
   * calculated scores
   */
  @Field()
  @Column({ type: "enum", enum: Object.values(Side) })
  movedBy: Side;

  @Field()
  @Column({ type: "integer" })
  qScore: number;
}

export default ChessMove;
