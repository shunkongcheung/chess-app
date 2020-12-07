import React, { memo } from "react";
import Link from "next/link";
import styled from "styled-components";

import { Side } from "../../constants";
import { getHashFromBoard } from "../../chess";
import {
  Button,
  ChessBoard,
  ListItemGroup,
  MoveListItem,
} from "../../components";

type Board = Array<Array<string>>;

type Position = [number, number];

interface Target {
  row: number;
  col: number;
  piece: string;
  board: Board;
}

interface MoveSequenceItem {
  side: Side;
  from: Target;
  to: Target;
  simpleScore: number;
  qScore: number;
}

interface GameSeriesProps {
  moveSequences: Array<MoveSequenceItem>;
}

const BoardDescContainer = styled.div`
  margin-top: 15px;
`;

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

const GameSeries: React.FC<GameSeriesProps> = ({ moveSequences }) => {
  const [step, setStep] = React.useState(0);
  const max = moveSequences.length;

  const handleStepChange = React.useCallback(
    (plus: number) => {
      setStep((o) => {
        const newNum = o + plus;
        console.log({ o, plus });
        if (newNum < 0) return 0;
        else if (newNum > max) return max;
        else return newNum;
      });
    },
    [setStep]
  );

  const board = React.useMemo(() => {
    if (step < max) return moveSequences[step].from.board;
    else return moveSequences[step - 1].to.board;
  }, [moveSequences, step, max]);

  const selectedChess = React.useMemo<Position | undefined>(
    () =>
      moveSequences[step]
        ? [moveSequences[step].from.row, moveSequences[step].from.col]
        : undefined,
    [moveSequences, step]
  );

  if (!moveSequences.length) return <>Something went wrong </>;

  return (
    <Container>
      <ChessCol>
        <ChessBoard board={board} selectedChess={selectedChess} />
        <BoardDescContainer>
          Board Score: {moveSequences[step]?.simpleScore}
        </BoardDescContainer>
        <ControlContainer>
          <Button disabled={step === 0} onClick={() => handleStepChange(-1)}>
            Backward
          </Button>
          <Button disabled={step >= max} onClick={() => handleStepChange(1)}>
            Forward
          </Button>
        </ControlContainer>
        <Link href={`/board-checker/${getHashFromBoard(board)}`}>
          <a target="_blank" rel="noreferrer">
            Board Check
          </a>
        </Link>
      </ChessCol>
      <MoveCol>
        <ListItemGroup>
          {moveSequences.map((item, idx) => (
            <MoveListItem
              {...item}
              extraDesc={`QScore: ${item.qScore.toFixed(2)}`}
              key={`ListItem-${idx}`}
              onClick={() => handleStepChange(idx - step + 1)}
            />
          ))}
        </ListItemGroup>
      </MoveCol>
    </Container>
  );
};

export default memo(GameSeries);
