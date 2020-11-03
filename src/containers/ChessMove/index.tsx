import React, { memo } from "react";
import styled from "styled-components";

import { ChessBoard } from "../../components";

import { getInitialBoard } from "../../chess";

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 450px;
`;

const ChessMove: React.FC = () => {
  const initBoard = getInitialBoard();
  return (
    <Container>
      <ChessBoard
        board={initBoard}
        handleSelect={() => {}}
        selectedChese={[0, 3]}
      />
    </Container>
  );
};

export default memo(ChessMove);
