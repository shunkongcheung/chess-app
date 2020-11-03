import getFriendlyPiecePositions from "./getFriendlyPiecePositions";
import getPieceNextPositions from "./getPieceNextPositions";

type Board = Array<Array<string>>;

type Position = [number, number];

const getAllNextPositions = (board: Board, isUpperSide: boolean) => {
  const positions = getFriendlyPiecePositions(board, isUpperSide);

  let nextMoves: Array<Position> = [];
  positions.map((position) => {
    nextMoves = [...nextMoves, ...getPieceNextPositions(board, position)];
  });
  return nextMoves;
};

export default getAllNextPositions;
