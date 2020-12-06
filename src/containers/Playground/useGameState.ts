import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { getBoardWinnerAndScore, getIsPieceEmpty } from "../../chess";

import { useMoveSteps } from "../../hooks";

type Board = Array<Array<string>>;

enum GameStage {
  START = "start",
  PLAYING = "playing",
  ENDED = "ended",
}

enum PlayerSide {
  TOP = "top",
  BOTTOM = "bottom",
}

interface GameStateShape {
  gameStage: GameStage;
  userSide: PlayerSide;
  compSide: PlayerSide;
  turnSide: PlayerSide;
}

function useGameState() {
  const [gameState, setGameState] = useState<GameStateShape>({
    gameStage: GameStage.START,
    userSide: PlayerSide.BOTTOM,
    compSide: PlayerSide.TOP,
    turnSide: PlayerSide.BOTTOM,
  });

  const { board, handleRevert, handleSelect, selectedChess } = useMoveSteps();

  const startGame = useCallback((userSide: PlayerSide) => {
    setGameState({
      gameStage: GameStage.PLAYING,
      userSide,
      compSide:
        userSide === PlayerSide.TOP ? PlayerSide.BOTTOM : PlayerSide.TOP,
      turnSide: PlayerSide.BOTTOM,
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

  const isUserTopSide = gameState.userSide === PlayerSide.TOP;

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
