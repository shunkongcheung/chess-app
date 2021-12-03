import { Piece } from "../constants";

const getPieceScore = (piecePrefix: string) => {
  const piecePrefixUpper = piecePrefix.toUpperCase();
  const pieceScore = [
    Piece.EMPTY.toUpperCase(),
    Piece.SOLDIER.toUpperCase(),
    Piece.JUMBO.toUpperCase(),
    Piece.KNIGHT.toUpperCase(),
    Piece.CANNON.toUpperCase(),
    Piece.HORSE.toUpperCase(),
    Piece.CASTLE.toUpperCase(),
    Piece.GENERAL.toUpperCase(),
  ];

  const pieceIndex = pieceScore.indexOf(piecePrefixUpper);
  return piecePrefixUpper === piecePrefix ? pieceIndex : -pieceIndex;
};

export default getPieceScore;
