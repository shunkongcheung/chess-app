import {
  CHS_EMPTY,
  CHS_CANNON,
  CHS_CASTLE,
  CHS_GENERAL,
  CHS_HORSE,
  CHS_JUMBO,
  CHS_KNIGHT,
  CHS_SOLDIER,
} from "../../chess/constants";

type Board = Array<Array<string>>;

const getChessDbStrFromBoard = (board: Board) => {
  let strBoard = "";

  board.map((row: Array<string>) => {
    let empty = 0;
    row.map((piece: string) => {
      // if empty, indent empty counter
      if (piece === CHS_EMPTY) empty++;
      else {
        // non empty, if empty exists, append empty counter and reset
        if (empty != 0) strBoard += `${empty}`;
        empty = 0;

        // add piece
        strBoard += getPiece(piece);
      }
    });

    if (empty != 0) strBoard += `${empty}`;
    strBoard += "/";
  });
  return strBoard;
};

const getPiece = (piece: string) => {
  const pieceUpper = piece.toUpperCase();

  switch (pieceUpper) {
    case CHS_CASTLE:
      return pieceUpper === piece ? "r" : "R";
    case CHS_HORSE:
      return pieceUpper === piece ? "n" : "N";
    case CHS_JUMBO:
      return pieceUpper === piece ? "b" : "B";
    case CHS_KNIGHT:
      return pieceUpper === piece ? "a" : "A";
    case CHS_GENERAL:
      return pieceUpper === piece ? "k" : "K";
    case CHS_CANNON:
      return pieceUpper === piece ? "c" : "C";
    case CHS_SOLDIER:
      return pieceUpper === piece ? "p" : "P";
    default:
      return piece;
  }
};

export default getChessDbStrFromBoard;
