import { Piece } from "../constants";
import { Board } from "../types";
import getPieceScore from "./getPieceScore";

const getBoardWinnerAndScore = (board: Board): [string, number] => {
  const winnerScore = 10000;
  let [total, isTGeneralExist, isBGeneralExist] = [0, false, false];

  board.map((row) => {
    row.map((piece) => {
      total += getPieceScore(piece);
      if (piece === Piece.GENERAL.toUpperCase()) isTGeneralExist = true;
      if (piece === Piece.GENERAL.toLowerCase()) isBGeneralExist = true;
    });
  });

  if (!isTGeneralExist)
    return [Piece.GENERAL.toLowerCase(), -winnerScore + total];
  if (!isBGeneralExist)
    return [Piece.GENERAL.toUpperCase(), winnerScore + total];

  return [Piece.EMPTY, total];
};

export default getBoardWinnerAndScore;
