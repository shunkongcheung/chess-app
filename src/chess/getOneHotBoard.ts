import {
  CHS_EMPTY,
  CHS_CANNON,
  CHS_CASTLE,
  CHS_GENERAL,
  CHS_HORSE,
  CHS_JUMBO,
  CHS_KNIGHT,
  CHS_SOLDIER,
} from "./constants";

type Board = Array<Array<string>>;

const getOneHotBoard = (board: Board) => {
  let results: Array<number> = [];
  board.map((row) =>
    row.map((piece) => {
      results = [...results, ...getOneHotPiece(piece)];
    })
  );
  return results;
};

const getOneHotPiece = (piece: string) => {
  const oneHot = Array.from({ length: 15 }).map(() => 0);

  if (piece === CHS_GENERAL.toUpperCase()) oneHot[0] = 1;
  if (piece === CHS_GENERAL.toLowerCase()) oneHot[1] = 1;

  if (piece === CHS_CASTLE.toUpperCase()) oneHot[2] = 1;
  if (piece === CHS_CASTLE.toLowerCase()) oneHot[3] = 1;

  if (piece === CHS_HORSE.toUpperCase()) oneHot[4] = 1;
  if (piece === CHS_HORSE.toLowerCase()) oneHot[5] = 1;

  if (piece === CHS_CANNON.toUpperCase()) oneHot[6] = 1;
  if (piece === CHS_CANNON.toLowerCase()) oneHot[7] = 1;

  if (piece === CHS_KNIGHT.toUpperCase()) oneHot[8] = 1;
  if (piece === CHS_KNIGHT.toLowerCase()) oneHot[9] = 1;

  if (piece === CHS_JUMBO.toUpperCase()) oneHot[10] = 1;
  if (piece === CHS_JUMBO.toLowerCase()) oneHot[11] = 1;

  if (piece === CHS_SOLDIER.toUpperCase()) oneHot[12] = 1;
  if (piece === CHS_SOLDIER.toLowerCase()) oneHot[13] = 1;

  if (piece === CHS_EMPTY) oneHot[14] = 1;

  return oneHot;
};

export default getOneHotBoard;
