import { CHS_GENERAL, CHS_EMPTY } from "./constants";
import getPieceScore from "./getPieceScore";
type Board = Array<Array<string>>;

const getBoardWinnerAndScore = (board: Board) => {
  const winnerScore = 10000;
  let [total, isTGeneralExist, isBGeneralExist] = [0, false, false];

  board.map((row) => {
    row.map((piece) => {
      total += getPieceScore(piece);
      if (piece === CHS_GENERAL.toUpperCase()) isTGeneralExist = true;
      if (piece === CHS_GENERAL.toLowerCase()) isBGeneralExist = true;
    });
  });

  if (!isTGeneralExist)
    return [CHS_GENERAL.toLowerCase(), -winnerScore + total];
  if (!isBGeneralExist) return [CHS_GENERAL.toUpperCase(), winnerScore + total];

  return [CHS_EMPTY, total];
};

export default getBoardWinnerAndScore;
