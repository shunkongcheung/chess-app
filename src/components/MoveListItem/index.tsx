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

import ChessPiece from "../ChessPiece";
import ListItem from "../ListItem";

interface Target {
  row: number;
  col: number;
  piece: string;
}

interface MoveListItemProps {
  extraDesc?: string;
  from: Target;
  to: Target;
  onClick?: () => any;
}

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
  flex-direction: column;
`;

const MoveListItem: React.FC<MoveListItemProps> = ({
  extraDesc,
  from,
  to,
  onClick,
}) => {
  const [ArrowIcon, desc] = React.useMemo(() => {
    const [right, down] = [to.col - from.col, to.row - from.row];
    const isUp = from.row > to.row;
    const isDown = from.row < to.row;

    const isLeft = from.col > to.col;
    const isRight = from.col < to.col;

    if (isUp) {
      if (!isLeft && !isRight) return [BsArrowUp, `Up ${-down}`];
      if (isLeft) return [BsArrowUpLeft, ""];
      if (isRight) return [BsArrowUpRight, ""];
    }
    if (isDown) {
      if (!isLeft && !isRight) return [BsArrowDown, `Down ${down}`];
      if (isLeft) return [BsArrowDownLeft, ""];
      if (isRight) return [BsArrowDownRight, ""];
    }
    if (isLeft) return [BsArrowLeft, `Left ${-right}`];
    if (isRight) return [BsArrowRight, `Right ${right}`];
  }, [from, to]);

  return (
    <Container onClick={onClick}>
      <ChessContainer>
        <ChessPiece pieceCode={from.piece} isSelected={false} />
      </ChessContainer>
      <ArrowIcon style={{ fontSize: 40 }} />
      <DescContainer>
        <div>{desc}</div>
        <div>{extraDesc}</div>
      </DescContainer>
      <ChessContainer>
        <ChessPiece pieceCode={to.piece} isSelected={false} />
      </ChessContainer>
    </Container>
  );
};

export default memo(MoveListItem);
