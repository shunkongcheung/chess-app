import getFriendlyPiecePositions from "./getFriendlyPiecePositions";
import getPieceNextPositions from "./getPieceNextPositions";

type Board = Array<Array<string>>;

type Position = [number, number];

interface Move {
  from: Position;
  to: Position;
}

const getAllNextPositions = (board: Board, isUpperSide: boolean) => {
  const positions = getFriendlyPiecePositions(board, isUpperSide);

  let nextMoves: Array<Move> = [];
  positions.map((position) => {
    nextMoves = [
      ...nextMoves,
      ...getPieceNextPositions(board, position).map((to) => ({
        from: position,
        to,
      })),
    ];
  });
  return nextMoves;
};

export default getAllNextPositions;
