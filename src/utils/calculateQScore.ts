import { Connection } from "typeorm";

import { Side } from "../constants";
import { ChessBoard, ChessMove, MoveSequence } from "../entities";

const calculateQScore = async (
  connection: Connection,
  moveSequences: Array<MoveSequence>
) => {
  const moveSequence = moveSequences.shift();
  if (!moveSequence) return;

  const { chessMove } = moveSequence;
  const isUpperSide = chessMove.side === Side.Top;
  const nextSide = isUpperSide ? Side.Bottom : Side.Top;

  const movedBoard = chessMove.toBoard.board;

  const chessBoard = await connection
    .getRepository(ChessBoard)
    .findOne({ board: movedBoard });

  const opponantChessMoves = await connection
    .getRepository(ChessMove)
    .createQueryBuilder("chessmove")
    .leftJoinAndSelect("chessmove.fromBoard", "fromBoard")
    .where(`"fromBoard"."id" = :id`, {
      id: chessBoard?.id || -1,
    })
    .andWhere(`"chessmove"."side" = :side`, { side: nextSide })
    .getMany();

  const scores = opponantChessMoves.length
    ? opponantChessMoves.map((chessMove) => chessMove.qScore)
    : [0];

  // the best score that i get aftr i move the board
  const optimalFutureReward = -Math.max(...scores);

  // populate qscores
  const { qScore: oQScore } = chessMove;
  let reward = chessMove.toBoard.simpleScore;
  if (!isUpperSide) reward = -reward;

  const predictValue = opponantChessMoves.length ? optimalFutureReward : reward;

  // adding predict value to existing value, if existing value is not zero, this
  // will accumulate as this spot is being visited more and more
  chessMove.qScore = predictValue + 0.01 * oQScore;

  // const addValue = ALPHA * (reward + GAMMA * optimalFutureReward - oQScore);
  // chessMove.qScore += addValue;

  await connection.getRepository(ChessMove).save(chessMove);

  return calculateQScore(connection, moveSequences);
};

export default calculateQScore;
