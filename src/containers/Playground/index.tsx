import React, { memo, useMemo } from "react";
import styled from "styled-components";

import GamePanel from "./GamePanel";
import SelectSidePanel from "./SelectSidePanel";
import useGameState from "./useGameState";

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 25px;
`;

interface PlaygroundProps {}

const Playground: React.FC<PlaygroundProps> = () => {
  const {
    board,
    gameStage,
    handleRevert,
    handleSelect,
    isUserTopSide,
    selectedChess,
    startGame,
  } = useGameState();

  if (gameStage === "start")
    return (
      <Container>
        <SelectSidePanel startGame={startGame} />
      </Container>
    );

  return (
    <Container>
      <GamePanel
        board={board}
        isUserTopSide={isUserTopSide}
        handleSelect={handleSelect}
        handleRevert={handleRevert}
        selectedChess={selectedChess}
      />
    </Container>
  );
};

export default memo(Playground);
