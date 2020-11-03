import { CHS_GENERAL } from "./constants";
import getIsPieceFriendly from "./getIsPieceFriendly";

type Board = Array<Array<string>>;

type Position = [number, number];

const getFriendlyPiecePositions = (board: Board, isUpperSide: boolean) => {
  const friendlyPositions: Array<Position> = [];

  const myPiece = isUpperSide
    ? CHS_GENERAL.toUpperCase()
    : CHS_GENERAL.toLowerCase();

  board.map((row, rowIdx) => {
    row.map((piecePrefix, colIdx) => {
      if (getIsPieceFriendly(myPiece, piecePrefix))
        friendlyPositions.push([rowIdx, colIdx]);
    });
  });

  return friendlyPositions;
};

export default getFriendlyPiecePositions;
