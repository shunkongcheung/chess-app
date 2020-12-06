import { useCallback, useState } from "react";

import {
  getIsPieceEmpty,
  getMovedBoard,
  getPieceNextPositions,
} from "../chess";

type Board = Array<Array<string>>;

interface Step {
  from: Position;
  to: Position;
  target: string;
}

type SetBoard = (board: Board) => any;

type Position = [number, number];

function useMoveSteps(board: Board, setBoard: SetBoard) {
  const [selectedChess, setSelectedChess] = useState<Position>([-1, -1]);
  const [steps, setSteps] = useState<Array<Step>>([]);

  const isSelected =
    selectedChess[0] !== -1 &&
    !getIsPieceEmpty(board[selectedChess[0]][selectedChess[1]]);

  const positions = isSelected
    ? getPieceNextPositions(board, selectedChess)
    : [];

  const handleMoveSelect = useCallback(
    (idx: number) => {
      const target = board[positions[idx][0]][positions[idx][1]];
      const step = { from: selectedChess, to: positions[idx], target };
      setSteps((o) => [...o, step]);
      setBoard(getMovedBoard(board, selectedChess, positions[idx]));
      setSelectedChess([-1, -1]);
    },
    [board, selectedChess]
  );

  const handleRemove = useCallback(() => {
    if (!isSelected) return;
    const target = board[selectedChess[0]][selectedChess[1]];
    const step = { from: selectedChess, to: selectedChess, target };
    setSteps((o) => [...o, step]);
    setBoard(getMovedBoard(o, selectedChess, selectedChess));
    setSelectedChess([-1, -1]);
  }, [isSelected]);

  const handleRevert = useCallback(() => {
    const lastStep = steps.pop();
    if (!!lastStep) {
      const newBoard = JSON.parse(JSON.stringify(board));
      const { from, to, target } = lastStep;
      newBoard[from[0]][from[1]] = newBoard[to[0]][to[1]];
      newBoard[to[0]][to[1]] = target;
      setBoard(newBoard);
    }

    setSteps([...steps]);
  }, [board, steps]);

  const handleSelect = useCallback(
    (newPosition: Position) => {
      setSelectedChess((o) => {
        if (o[0] === newPosition[0] && o[1] === newPosition[1]) return [-1, -1];

        for (let idx = 0; idx < positions.length; idx++) {
          const curPosition = positions[idx];
          if (
            curPosition[0] === newPosition[0] &&
            curPosition[1] === newPosition[1]
          ) {
            handleMoveSelect(idx);
            return [-1, -1];
          }
        }

        return newPosition;
      });
    },
    [handleMoveSelect, positions]
  );

  return {
    handleMoveSelect,
    handleRemove,
    handleRevert,
    handleSelect,
    isSelected,
    positions,
    selectedChess,
    steps,
  };
}

export default useMoveSteps;
