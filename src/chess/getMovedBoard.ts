import { CHS_EMPTY } from "./constants";

type Board = Array<Array<string>>;
type Position = [number, number];

const getMovedBoard = (board: Board, from: Position, to: Position) => {
  const newBoard = JSON.parse(JSON.stringify(board));
  newBoard[to[0]][to[1]] = newBoard[from[0]][from[1]];
  newBoard[from[0]][from[1]] = CHS_EMPTY;

  return newBoard;
};

export default getMovedBoard;
