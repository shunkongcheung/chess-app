import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";
import { Side } from "../constants";

/**
 * @swagger
 *
 * definitions:
 *   ChessMlModel:
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *       side:
 *         $ref: '#/components/Side'
 *       netModel:
 *         type: string
 */

@Entity()
class ChessMlModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: Object.values(Side) })
  side: Side;

  @Column()
  netModel: string;
}

export default ChessMlModel;
