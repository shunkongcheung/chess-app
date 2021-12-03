import { Side } from "./constants";
import { getInitialBoard } from "./chess";
import getDbConnection from "./getDbConnection";
import { insertChessBoards } from "./services";

const start = async () => {
  const conn = await getDbConnection();

  // create initial board
  const initialBoard = getInitialBoard();
  const saved = await insertChessBoards(conn, [initialBoard], Side.Bottom);
};

start();
