import { Piece } from "../constants";
import { Board, Position } from "../types";

import getIsPieceFriendly from "./getIsPieceFriendly";

const getFriendlyPiecePositions = (board: Board, isUpperSide: boolean) => {
  const friendlyPositions: Array<Position> = [];

  const myPiece = isUpperSide
    ? Piece.GENERAL.toUpperCase()
    : Piece.GENERAL.toLowerCase();

  board.map((row, rowIdx) => {
    row.map((piecePrefix, colIdx) => {
      if (getIsPieceFriendly(myPiece, piecePrefix))
        friendlyPositions.push([rowIdx, colIdx]);
    });
  });

  return friendlyPositions;
};

export default getFriendlyPiecePositions;
