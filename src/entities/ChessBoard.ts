import { Piece, Side } from "../constants";
import { Column, PrimaryGeneratedColumn, Entity, Index } from "typeorm";

@Entity()
class ChessBoard {
  @PrimaryGeneratedColumn()
  id: number;

  // a short hash calculated using Bernstein's popular "times 33" hash algorithm
  // see [here](https://www.npmjs.com/package/short-hash)
  @Column({ unique: true })
  @Index()
  shortHash: string;

  @Column()
  board: string;

  // score calculated based on board current situation
  @Column({ type: "integer" })
  score: number;

  // indicate the board should be moved by upper side or lower side
  // always starts moving by lower side
  // i.e. initial board's toBeMovedBy = lowerSide
  @Column({
    type: "enum",
    enum: Object.values(Side),
  })
  toBeMovedBy: Side;

  // flag to indicate if this board's next movement has been calculated
  @Column({ default: false })
  isMoved: boolean;
}

export default ChessBoard;
