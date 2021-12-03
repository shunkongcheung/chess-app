import { Piece } from "../constants";
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
    [Piece.CASTLE.toUpperCase()]: getCastleNextPositions,
    [Piece.CANNON.toUpperCase()]: getCannonNextPositions,
    [Piece.GENERAL.toUpperCase()]: getGeneralNextPositions,
    [Piece.HORSE.toUpperCase()]: getHorseNextPositions,
    [Piece.JUMBO.toUpperCase()]: getJumboNextPositions,
    [Piece.KNIGHT.toUpperCase()]: getKnightNextPositions,
    [Piece.SOLDIER.toUpperCase()]: getSoldierNextPositions,
  };
  const piecePrefix = board[piecePosition[0]][piecePosition[1]].toUpperCase();
  const pieceFunc = funcs[piecePrefix];

  return pieceFunc(board, piecePosition);
};

export default getPieceNextPositions;
