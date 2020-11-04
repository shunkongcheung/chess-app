import { ChessMove } from "../../entities";
import { getBoardFromHash } from "../../chess";
/**
 * @swagger
 *
 * components:
 *   SerializedChessMove:
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
 */

const getSerializedChessMove = (chessMove: ChessMove) => ({
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
});

export default getSerializedChessMove;
