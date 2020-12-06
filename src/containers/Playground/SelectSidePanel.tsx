import React, { memo } from "react";
import styled from "styled-components";

import { Button } from "../../components";
import { Side } from "../../constants";

const ChooseBtn = styled(Button)`
  width: 150px;
  margin-bottom: 15px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

interface SelectSidePanelProps {
  startGame: (side: Side) => any;
}

const SelectSidePanel: React.FC<SelectSidePanelProps> = ({ startGame }) => {
  return (
    <Container>
      <ChooseBtn onClick={() => startGame(Side.Top)}>紅棋（後走）</ChooseBtn>
      <ChooseBtn onClick={() => startGame(Side.Bottom)}>黑棋（後走）</ChooseBtn>
    </Container>
  );
};

export default memo(SelectSidePanel);
