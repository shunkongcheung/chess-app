import { Connection } from "typeorm";
// import brain from "brain.js";

// import { getOneHotBoard } from "../../chess";
// import { ChessMlModel } from "../../entities";
import {
  getMovedBoard,
  getHashFromBoard,
  getBoardWinnerAndScore,
} from "../../chess";
import { ChessBoard, ChessMove } from "../../entities";
import { Side } from "../../constants";

type Board = Array<Array<string>>;

type Position = [number, number];

interface Move {
  from: Position;
  to: Position;
}

interface Query {
  board: Board;
  side: Side;
  moves: Array<Move>;
}

/**
 * @swagger
 *
 * components:
 *   ChooseChessMl:
 *     type: object
 *     properties:
 *       from:
 *         type: array
 *         items:
 *           type: number
 *       to:
 *         type: array
 *         items:
 *           type: number
 *
 */

// const choose = async (connection: Connection, query: Query): Promise<Move> => {
//   const { side, board, moves } = query;
//   const chessMlModel = await connection
//     .getRepository(ChessMlModel)
//     .findOne({ side });

//   if (!chessMlModel) {
//     console.warn("No model trained yet. Return randomly");
//     // return moves[Math.floor(Math.random() * moves.length)];
//     return moves[0];
//   }
//   const { netModel } = chessMlModel;

//   const net = new brain.NeuralNetwork();
//   net.fromJSON(JSON.parse(netModel));

//   const oneHotBoard = getOneHotBoard(board);
//   const scoredMoves = moves.map((move) => ({
//     score: (net.run([...oneHotBoard, ...move.from, ...move.to]) as any).score,
//     move,
//   }));

//   scoredMoves.sort((a, b) => a.score - b.score);

//   if (side === Side.Top) return scoredMoves[scoredMoves.length - 1].move;
//   else return scoredMoves[0].move;
// };
const getScore = (board: Board, move: Move, side: Side) => {
  const movedBoard = getMovedBoard(board, move.from, move.to);
  const [_, score] = getBoardWinnerAndScore(movedBoard);
  return side === Side.Top ? score : -score;
};

const getChessBoard = async (
  connection: Connection,
  chessBoard: ChessBoard | null,
  side: Side
) => {
  if (!chessBoard) return [];
  return connection.getRepository(ChessMove).find({
    where: { fromBoard: chessBoard, side },
    order: { qScore: "DESC" },
  });
};

const choose = async (connection: Connection, query: Query): Promise<Move> => {
  const { side, board, moves } = query;
  const hashBoard = getHashFromBoard(board);
  const chessBoard = await connection.getRepository(ChessBoard).findOne({
    where: { board: hashBoard },
  });

  const chessMoves = await getChessBoard(connection, chessBoard, side);

  if (chessMoves.length === moves.length) {
    // if all possibilites has been explored, choose from experience
    const selectedMove = chessMoves[0];
    return {
      from: [selectedMove.fromRow, selectedMove.fromCol],
      to: [selectedMove.toRow, selectedMove.toCol],
    };
  } else {
    // for those of which its not hit before, use current board score to calculate
    const compareArr = moves.map((move) => {
      const exist = chessMoves.find(
        (chessMove) =>
          chessMove.fromRow === move.from[0] &&
          chessMove.fromCol === move.from[1] &&
          chessMove.toRow === move.to[0] &&
          chessMove.toCol === move.to[1]
      );
      const score = exist ? exist.qScore : getScore(board, move, side);
      return { score, move };
    });

    compareArr.sort((a, b) => b.score - a.score);
    return compareArr[0].move;
  }
};

export default choose;
