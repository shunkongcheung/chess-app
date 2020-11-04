import React, { memo } from "react";
import styled from "styled-components";

import {
  Button,
  ChessBoard,
  ListItemGroup,
  MoveListItem,
} from "../../components";

import {
  getHashFromBoard,
  getMovedBoard,
  getPieceNextPositions,
  getInitialBoard,
  getIsPieceEmpty,
} from "../../chess";

type Position = [number, number];

interface Step {
  from: Position;
  to: Position;
  target: string;
}

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  max-width: 1080px;
  padding: 30px;
`;

const ControlContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-evenly;
`;

const ChessCol = styled.div`
  width: 450px;
`;
const MoveCol = styled.div`
  margin-left: auto;
  width: 450px;
  max-height: 570px;
`;

const ChessMove: React.FC = () => {
  const [board, setBoard] = React.useState(getInitialBoard());
  const [selectedChess, setSelectedChess] = React.useState<Position>([-1, -1]);
  const [steps, setSteps] = React.useState<Array<Step>>([]);

  const isSelected =
    selectedChess[0] !== -1 &&
    !getIsPieceEmpty(board[selectedChess[0]][selectedChess[1]]);

  const positions = isSelected
    ? getPieceNextPositions(board, selectedChess)
    : [];

  const handleMoveSelect = React.useCallback(
    (idx: number) => {
      const target = board[positions[idx][0]][positions[idx][1]];
      const step = { from: selectedChess, to: positions[idx], target };
      setSteps((o) => [...o, step]);
      setBoard((o) => getMovedBoard(o, selectedChess, positions[idx]));
      setSelectedChess([-1, -1]);
    },
    [selectedChess]
  );

  const handleSelect = React.useCallback(
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

  const handleRemove = React.useCallback(() => {
    if (!isSelected) return;
    const target = board[selectedChess[0]][selectedChess[1]];
    const step = { from: selectedChess, to: selectedChess, target };
    setSteps((o) => [...o, step]);
    setBoard((o) => getMovedBoard(o, selectedChess, selectedChess));
    setSelectedChess([-1, -1]);
  }, [isSelected]);

  const handleRevert = React.useCallback(() => {
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

  return (
    <Container>
      <ChessCol>
        <ChessBoard
          board={board}
          handleSelect={handleSelect}
          selectedChess={selectedChess}
        />
        <ControlContainer>
          <Button disabled={!steps.length} onClick={handleRevert}>
            Revert
          </Button>
          <Button disabled={!isSelected} onClick={handleRemove}>
            Remove
          </Button>
        </ControlContainer>
        <pre>{getHashFromBoard(board)}</pre>
      </ChessCol>
      <MoveCol>
        <ListItemGroup>
          {positions.map((position, idx) => (
            <MoveListItem
              key={`ListItem-${idx}`}
              onClick={() => handleMoveSelect(idx)}
              to={{
                row: position[0],
                col: position[1],
                piece: board[position[0]][position[1]],
              }}
              from={{
                row: selectedChess[0],
                col: selectedChess[1],
                piece: board[selectedChess[0]][selectedChess[1]],
              }}
            />
          ))}
        </ListItemGroup>
      </MoveCol>
    </Container>
  );
};

export default memo(ChessMove);
