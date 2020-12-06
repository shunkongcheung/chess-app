import { useCallback, useEffect, useState } from "react";

import {
  getIsPieceEmpty,
  getInitialBoard,
  getMovedBoard,
  getPieceNextPositions,
} from "../chess";

type Board = Array<Array<string>>;

interface Step {
  from: Position;
  to: Position;
  target: string;
}

interface State {
  board: Board;
  selectedChess: Position;
  steps: Array<Step>;
}

type Position = [number, number];

const getIsSelected = (board: Board, selectedChess: Position) =>
  selectedChess[0] !== -1 &&
  !getIsPieceEmpty(board[selectedChess[0]][selectedChess[1]]);

function useMoveSteps(initBoard?: Board) {
  const [state, setState] = useState<State>({
    board: initBoard || getInitialBoard(),
    selectedChess: [-1, -1],
    steps: [],
  });

  const handleMoveSelect = useCallback((idx: number) => {
    setState((o) => {
      const { board, selectedChess, steps } = o;
      const isSelected = getIsSelected(board, selectedChess);
      const positions = isSelected
        ? getPieceNextPositions(board, selectedChess)
        : [];

      const target = board[positions[idx][0]][positions[idx][1]];
      const step = { from: selectedChess, to: positions[idx], target };

      return {
        steps: [...steps, step],
        board: getMovedBoard(board, selectedChess, positions[idx]),
        selectedChess: [-1, -1],
      };
    });
  }, []);

  const handleRemove = useCallback(() => {
    setState((o) => {
      const { board, selectedChess, steps } = o;
      const isSelected = getIsSelected(board, selectedChess);
      if (!isSelected) return o;
      const target = board[selectedChess[0]][selectedChess[1]];
      const step = { from: selectedChess, to: selectedChess, target };

      return {
        steps: [...steps, step],
        board: getMovedBoard(o.board, selectedChess, selectedChess),
        selectedChess: [-1, -1],
      };
    });
  }, []);

  const handleRevert = useCallback((times: number = 1) => {
    setState((o) => {
      const { board, steps } = o;

      if (steps.length < times) return o;

      let newBoard = JSON.parse(JSON.stringify(board));
      for (let idx = 0; idx < times; idx++) {
        const lastStep = steps.pop();
        if (!lastStep) return o;

        newBoard = JSON.parse(JSON.stringify(newBoard));
        const { from, to, target } = lastStep;
        newBoard[from[0]][from[1]] = newBoard[to[0]][to[1]];
        newBoard[to[0]][to[1]] = target;
      }
      return {
        board: newBoard,
        steps: [...steps],
        selectedChess: o.selectedChess,
      };
    });
  }, []);

  const handleSelect = useCallback(
    async (newPosition: Position) => {
      return new Promise((resolve) => {
        setState((o) => {
          const { board, selectedChess, steps } = o;
          if (
            selectedChess[0] === newPosition[0] &&
            selectedChess[1] === newPosition[1]
          ) {
            // select same position, unselect it
            resolve(false);
            return { ...o, selectedChess: [-1, -1] };
          }

          const isSelected = getIsSelected(board, selectedChess);
          const positions = isSelected
            ? getPieceNextPositions(board, selectedChess)
            : [];

          for (let idx = 0; idx < positions.length; idx++) {
            const curPosition = positions[idx];
            if (
              curPosition[0] === newPosition[0] &&
              curPosition[1] === newPosition[1]
            ) {
              const target = board[curPosition[0]][curPosition[1]];
              const step = { from: selectedChess, to: curPosition, target };
              resolve(true);
              return {
                board: getMovedBoard(board, selectedChess, curPosition),
                steps: [...steps, step],
                selectedChess: [-1, -1],
              };
            }
          }
          resolve(false);
          return { ...o, selectedChess: newPosition };
        });
      });
    },
    [handleMoveSelect]
  );

  useEffect(() => {
    if (initBoard) setState((o) => ({ ...o, board: initBoard }));
  }, [initBoard]);

  const { board, selectedChess, steps } = state;
  const isSelected =
    selectedChess[0] !== -1 &&
    !getIsPieceEmpty(board[selectedChess[0]][selectedChess[1]]);

  const positions = isSelected
    ? getPieceNextPositions(board, selectedChess)
    : [];

  return {
    board,
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
