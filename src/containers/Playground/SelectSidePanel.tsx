import React, { memo } from "react";
import styled from "styled-components";

import { Button } from "../../components";

const ChooseBtn = styled(Button)`
  width: 150px;
  margin-bottom: 15px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

enum PlayerSide {
  TOP = "top",
  BOTTOM = "bottom",
}

interface SelectSidePanelProps {
  startGame: (side: PlayerSide) => any;
}

const SelectSidePanel: React.FC<SelectSidePanelProps> = ({ startGame }) => {
  return (
    <Container>
      <ChooseBtn onClick={() => startGame("top")}>紅棋（後走）</ChooseBtn>
      <ChooseBtn onClick={() => startGame("bottom")}>黑棋（後走）</ChooseBtn>
    </Container>
  );
};

export default memo(SelectSidePanel);
