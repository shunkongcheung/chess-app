import { Connection } from "typeorm";
import axios from "axios";

import {
  getBoardWinnerAndScore,
  getIsPieceEmpty,
  getMovedBoard,
} from "../../chess";
import { Side } from "../../constants";
import getChessDbStrFromBoard from "./getChessDbStrFromBoard";

import { improve } from "../chess-ml";

type Board = Array<Array<string>>;

interface Query {
  side: Side;
  board: Board;
  round: number;
  steps: number;
}

interface Move {
  from: [number, number];
  to: [number, number];
}

const getMove = async (url: string): Promise<Move> => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(({ data }) => {
        const dataStr = data.slice(5);
        const aCharCodeAt = "a".charCodeAt(0);
        const boardHeight = 9;

        if (dataStr.includes("nobestmove")) reject();

        resolve({
          from: [
            boardHeight - parseInt(dataStr[1]),
            dataStr[0].charCodeAt(0) - aCharCodeAt,
          ],
          to: [
            boardHeight - parseInt(dataStr[3]),
            dataStr[2].charCodeAt(0) - aCharCodeAt,
          ],
        });
      })
      .catch(reject);
  });
};

const getMoves = async (board: Board, side: Side, counter: number) => {
  if (counter === 0) return [];
  if (!getIsPieceEmpty(getBoardWinnerAndScore(board)[0])) return [];

  const chessdbStr = getChessDbStrFromBoard(board);
  const sideStr = side === Side.Bottom ? "w" : "b";

  try {
    const move = await getMove(
      `http://www.chessdb.cn/chessdb.php?action=querybest&board=${chessdbStr} ${sideStr}`
    );

    const movedBoard = getMovedBoard(board, move.from, move.to);
    return [
      move,
      ...(await getMoves(
        movedBoard,
        side === Side.Bottom ? Side.Top : Side.Bottom,
        counter - 1
      )),
    ];
  } catch (ex) {
    return [];
  }
};

const chessdb = async (connection: Connection, query: Query) => {
  const { board, side, round, steps } = query;

  for (let idx = 0; idx < round; idx++) {
    const moves = await getMoves(board, side, steps);
    await improve(connection, {
      startBoard: board,
      botPlayerIsComp: false,
      topPlayerIsComp: false,
      moves,
    });
  }
};

export default chessdb;
