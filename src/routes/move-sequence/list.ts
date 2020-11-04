import { Connection } from "typeorm";
import { getBoardFromHash } from "../../chess";
import { MoveSequence, GameSeries } from "../../entities";

/**
 * @swagger
 *
 * components:
 *   MoveSequenceItem:
 *     type: object
 *     properties:
 *       simpleScore:
 *         type: number
 *       qScore:
 *         type: number
 *       side:
 *         type: string
 *         $ref: '#/components/Side'
 *       from:
 *         type: object
 *         properties:
 *           row:
 *             type: integer
 *           col:
 *             type: integer
 *           piece:
 *             type: string
 *           board:
 *             type: array
 *             items:
 *               type: array
 *               items:
 *                 type: string
 *       to:
 *         type: object
 *         properties:
 *           row:
 *             type: integer
 *           col:
 *             type: integer
 *           board:
 *             type: array
 *             items:
 *               type: array
 *               items:
 *                 type: string
 *
 *   ListMoveSequence:
 *     type: object
 *     properties:
 *       count:
 *         type: number
 *       results:
 *         type: array
 *         items:
 *           $ref: '#/components/MoveSequenceItem'
 *
 */

interface Query {
  gameSeries: number;
}

const list = async (connection: Connection, query: Query) => {
  const gameSeries = await connection
    .getRepository(GameSeries)
    .findOne(query.gameSeries);

  const [rawData, count] = await connection
    .getRepository(MoveSequence)
    .findAndCount({
      where: { gameSeries },
      relations: ["chessMove", "chessMove.fromBoard", "chessMove.toBoard"],
      order: { id: "ASC" },
    });

  const results = rawData.map(({ chessMove }) => ({
    simpleScore: chessMove.fromBoard.simpleScore,
    qScore: chessMove.qScore,
    side: chessMove.side,
    from: {
      row: chessMove.fromRow,
      col: chessMove.fromCol,
      piece: chessMove.fromPiece,
      board: getBoardFromHash(chessMove.fromBoard.board),
    },
    to: {
      row: chessMove.toRow,
      col: chessMove.toCol,
      piece: chessMove.toPiece,
      board: getBoardFromHash(chessMove.toBoard.board),
    },
  }));

  return { count, results };
};

export default list;
