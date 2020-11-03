import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

enum Side {
  Top = "top",
  Bottom = "bottom",
}

/**
 * @swagger
 *
 * definitions:
 *   BoardStep:
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *       board:
 *         type: string
 *       side:
 *         type: string
 *         enum: [top, bottom]
 *       simpleScore:
 *         type: number
 *       qScore:
 *         type: number
 */

@Entity()
class BoardStep {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  board: string;

  @Column({ type: "enum", enum: Object.values(Side) })
  side: Side;

  @Column({ type: "integer" })
  simpleScore: number;

  @Column({ type: "float" })
  qScore: number;
}

export default BoardStep;
