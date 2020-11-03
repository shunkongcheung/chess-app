import {
  CHS_CANNON,
  CHS_CASTLE,
  CHS_GENERAL,
  CHS_HORSE,
  CHS_JUMBO,
  CHS_KNIGHT,
  CHS_SOLDIER,
} from "./constants";
import getCastleNextPositions from "./getCastlePositions";
import getCannonNextPositions from "./getCannonNextPositions";
import getGeneralNextPositions from "./getGeneralNextPositions";
import getHorseNextPositions from "./getHorseNextPositions";
import getJumboNextPositions from "./getJumboNextPositions";
import getKnightNextPositions from "./getKnightNextPositions";
import getSoldierNextPositions from "./getSoldierNextPositions";

type Board = Array<Array<string>>;

type Position = [number, number];

const getPieceNextPositions = (board: Board, piecePosition: Position) => {
  const funcs = {
    [CHS_CASTLE.toUpperCase()]: getCastleNextPositions,
    [CHS_CANNON.toUpperCase()]: getCannonNextPositions,
    [CHS_GENERAL.toUpperCase()]: getGeneralNextPositions,
    [CHS_HORSE.toUpperCase()]: getHorseNextPositions,
    [CHS_JUMBO.toUpperCase()]: getJumboNextPositions,
    [CHS_KNIGHT.toUpperCase()]: getKnightNextPositions,
    [CHS_SOLDIER.toUpperCase()]: getSoldierNextPositions,
  };
  const piecePrefix = board[piecePosition[0]][piecePosition[1]].toUpperCase();
  const pieceFunc = funcs[piecePrefix];

  return pieceFunc(board, piecePosition);
};

export default getPieceNextPositions;
