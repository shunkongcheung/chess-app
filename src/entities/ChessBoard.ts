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
  boardScore: number;

  // expected score base on next moves
  // calculated recursively
  // score 0 indicates value is not calculated
  @Column({ type: "integer" })
  expectedScore: number;
}

export default ChessBoard;
