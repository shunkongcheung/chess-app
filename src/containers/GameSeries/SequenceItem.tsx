import React, { memo } from "react";
import styled from "styled-components";

import {
  BsArrowUp,
  BsArrowDown,
  BsArrowLeft,
  BsArrowRight,
  BsArrowDownLeft,
  BsArrowDownRight,
  BsArrowUpLeft,
  BsArrowUpRight,
} from "react-icons/bs";

import { ChessPiece, ListItem } from "../../components";

const Container = styled(ListItem)<{ onClick?: Function }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ onClick }) => (!!onClick ? "cursor: pointer;" : "")}

  :hover {
    background: #fbf7f7;
    border-color: #ddd;
  }
`;

const ChessContainer = styled.div`
  height: auto;
  width: 50px;
`;

const DescContainer = styled.div`
  display: flex;
`;

interface Target {
  row: number;
  col: number;
  piece: string;
}

interface SequenceItemProps {
  from: Target;
  to: Target;
  onClick?: () => any;
}

const SequenceItem: React.FC<SequenceItemProps> = ({ from, to, onClick }) => {
  const ArrowIcon = React.useMemo(() => {
    const isUp = from.row > to.row;
    const isDown = from.row < to.row;

    const isLeft = from.col < to.col;
    const isRight = from.col > to.col;

    if (isUp) {
      if (!isLeft && !isRight) return BsArrowUp;
      if (isLeft) return BsArrowUpLeft;
      if (isRight) return BsArrowUpRight;
    }
    if (isDown) {
      if (!isLeft && !isRight) return BsArrowDown;
      if (isLeft) return BsArrowDownLeft;
      if (isRight) return BsArrowDownRight;
    }
    if (isLeft) return BsArrowLeft;
    if (isRight) return BsArrowRight;
  }, []);

  return (
    <Container onClick={onClick}>
      <ChessContainer>
        <ChessPiece pieceCode={from.piece} isSelected={false} />
      </ChessContainer>
      <DescContainer>
        <ArrowIcon style={{ fontSize: 40 }} />
      </DescContainer>
      <ChessContainer>
        <ChessPiece pieceCode={to.piece} isSelected={false} />
      </ChessContainer>
    </Container>
  );
};

export default memo(SequenceItem);
