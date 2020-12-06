import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { getBoardWinnerAndScore, getIsPieceEmpty } from "../../chess";
import { Side } from "../../constants";
import { useMoveSteps } from "../../hooks";

import useImprove from "./useImprove";

enum GameStage {
  START = "start",
  PLAYING = "playing",
  ENDED = "ended",
}

interface GameStateShape {
  gameStage: GameStage;
  userSide: Side;
  compSide: Side;
  turnSide: Side;
}

function useGameState() {
  const [gameState, setGameState] = useState<GameStateShape>({
    gameStage: GameStage.START,
    userSide: Side.Bottom,
    compSide: Side.Top,
    turnSide: Side.Bottom,
  });

  const {
    board,
    handleRevert,
    handleSelect,
    selectedChess,
    steps,
  } = useMoveSteps();

  useImprove(gameState.compSide, gameState.gameStage, steps);

  const startGame = useCallback((userSide: Side) => {
    setGameState({
      gameStage: GameStage.PLAYING,
      userSide,
      compSide: userSide === Side.Top ? Side.Bottom : Side.Top,
      turnSide: Side.Bottom,
    });
  }, []);

  useEffect(() => {
    // ask computer to make a move
    //
    // if not in game, exit
    if (gameState.gameStage !== GameStage.PLAYING) return;

    // if in game and is not computer's turn, exit
    if (gameState.compSide !== gameState.turnSide) return;

    // make a move
    axios
      .post(`/api/chess-ml/choose`, {
        side: gameState.compSide,
        board,
      })
      .then(({ data }) => {
        handleSelect(data.from);
        setGameState((o) => ({ ...o, turnSide: o.userSide }));
        setTimeout(async () => {
          handleSelect(data.to);
        }, 1000);
      });
  }, [board, gameState.turnSide, gameState.compSide, gameState.gameStage]);

  useEffect(() => {
    // update game status
    setGameState((o) => {
      if (o.gameStage !== GameStage.PLAYING) return o;

      const [winner] = getBoardWinnerAndScore(board);
      const gameStage = getIsPieceEmpty(winner)
        ? GameStage.PLAYING
        : GameStage.ENDED;
      return {
        ...o,
        gameStage,
      };
    });
  }, [board]);

  // returning
  const isUserTopSide = gameState.userSide === Side.Top;

  const handleSelectWithTurnUpdate = useCallback(
    async (pos: any) => {
      const updated = await handleSelect(pos);
      if (updated) setGameState((o) => ({ ...o, turnSide: o.compSide }));
    },
    [handleSelect]
  );

  const handleRevertTwice = useCallback(() => {
    // revert twice,
    // 1 revert comp move
    // 2 revert players move
    handleRevert(2);
  }, [handleRevert]);

  return {
    ...gameState,
    board,
    handleRevert: handleRevertTwice,
    handleSelect: handleSelectWithTurnUpdate,
    isUserTopSide,
    selectedChess,
    startGame,
  };
}

export default useGameState;
