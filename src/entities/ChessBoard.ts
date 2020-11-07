import { Column, PrimaryGeneratedColumn, Entity, Index } from "typeorm";

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
 *       simpleScore:
 *         type: number
 */

@Entity()
class ChessBoard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index()
  board: string;

  @Column({ type: "integer" })
  simpleScore: number;
}

export default ChessBoard;
