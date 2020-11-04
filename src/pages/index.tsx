import React from "react";
import { useRouter } from "next/router";
import { getInitialBoard, getHashFromBoard } from "../chess";

export default function Home() {
  const router = useRouter();

  React.useEffect(() => {
    const board = getInitialBoard();
    const hash = getHashFromBoard(board);
    router.push(`/board-checker/${hash}`);
  }, []);

  return <></>;
}
