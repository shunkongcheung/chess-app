import { useEffect, useRef } from "react";
import axios from "axios";

import { Side } from "../../constants";

interface Step {
  from: [number, number];
  to: [number, number];
}

function useImprove(compSide: Side, gameStage: string, steps: Array<Step>) {
  const sentLong = useRef(false);
  const sentEnd = useRef(false);

  useEffect(() => {
    // send only if there are more than 50 steps
    if (steps.length < 50) return;
    if (sentLong.current) return;
    sentLong.current = true;

    axios.post("/api/chess-ml/improve", {
      topPlayerIsComp: compSide === Side.Top,
      botPlayerIsComp: compSide === Side.Bottom,
      moves: steps,
    });
  }, [compSide, steps]);

  useEffect(() => {
    // send only if there are more than 50 steps
    if (gameStage !== "ended") return;
    if (sentEnd.current) return;
    sentEnd.current = true;

    axios.post("/api/chess-ml/improve", {
      topPlayerIsComp: compSide === Side.Top,
      botPlayerIsComp: compSide === Side.Bottom,
      moves: steps,
    });
  }, [compSide, steps, gameStage]);

  useEffect(() => {
    if (gameStage !== "start") return;
    sentEnd.current = false;
    sentLong.current = false;
  }, [gameStage, steps]);
}

export default useImprove;
