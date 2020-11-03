import {
  CHS_EMPTY,
  CHS_SOLDIER,
  CHS_JUMBO,
  CHS_KNIGHT,
  CHS_CANNON,
  CHS_HORSE,
  CHS_CASTLE,
  CHS_GENERAL,
} from "./constants";

const getPieceScore = (piecePrefix: string) => {
  const piecePrefixUpper = piecePrefix.toUpperCase();
  const pieceScore = [
    CHS_EMPTY.toUpperCase(),
    CHS_SOLDIER.toUpperCase(),
    CHS_JUMBO.toUpperCase(),
    CHS_KNIGHT.toUpperCase(),
    CHS_CANNON.toUpperCase(),
    CHS_HORSE.toUpperCase(),
    CHS_CASTLE.toUpperCase(),
    CHS_GENERAL.toUpperCase(),
  ];

  const pieceIndex = pieceScore.indexOf(piecePrefixUpper);
  return piecePrefixUpper === piecePrefix ? pieceIndex : -pieceIndex;
};

export default getPieceScore;
