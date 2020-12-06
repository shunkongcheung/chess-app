import React, { memo, useCallback, useMemo } from "react";
import styled from "styled-components";

import { Button, ChessBoard } from "../../components";

type Board = Array<Array<string>>;

interface GamePanelProps {
  board: Board;
  handleSelect: (position: Position) => any;
  handleRevert: () => any;
  isUserTopSide: boolean;
  selectedChess: Position;
}

type Position = [number, number];

const Container = styled.div``;

const BoardContainer = styled.div`
  width: 350px;
`;

const GamePanel: React.FC<GamePanelProps> = ({
  board,
  handleSelect,
  handleRevert,
  isUserTopSide,
  selectedChess,
}) => {
  const showBoard = useMemo(
    () => (isUserTopSide ? [...board].reverse() : [...board]),
    [board, isUserTopSide]
  );

  const handleSelectConsiderSide = useCallback(
    (position: Position) => {
      if (isUserTopSide) position[0] = 9 - position[0];
      handleSelect(position);
    },
    [isUserTopSide, handleSelect]
  );

  const selectedChessConsiderSide = useMemo(() => {
    const selected: Position = [...selectedChess];
    if (isUserTopSide) selected[0] = 9 - selected[0];
    return selected;
  }, [selectedChess, isUserTopSide]);

  return (
    <Container>
      <BoardContainer>
        <ChessBoard
          board={showBoard}
          handleSelect={handleSelectConsiderSide}
          selectedChess={selectedChessConsiderSide}
        />
      </BoardContainer>
      <Button onClick={handleRevert}>Revert</Button>
    </Container>
  );
};

export default memo(GamePanel);
