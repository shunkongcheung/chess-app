import { CHS_GENERAL as GL, CHS_EMPTY as EMY } from "./constants";

type Board = Array<Array<string>>;

const getWinner = (board: Board) => {
  let [isTopGeneralExist, isBottomGeneralExist] = [false, false];
  board.map((row) => {
    row.map((piece) => {
      if (piece === GL.toUpperCase()) isTopGeneralExist = true;
      if (piece === GL.toLowerCase()) isBottomGeneralExist = true;
    });
  });

  if (!isTopGeneralExist) return GL.toLowerCase();
  if (!isBottomGeneralExist) return GL.toUpperCase();

  return EMY;
};

export default getWinner;
