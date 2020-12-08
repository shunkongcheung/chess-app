import { MoreThan, LessThan, Connection } from "typeorm";
import axios from "axios";

import {
  getBoardFromHash,
  getBoardWinnerAndScore,
  getIsPieceEmpty,
  getMovedBoard,
} from "../../chess";
import { ChessMove } from "../../entities";
import { Side } from "../../constants";
import getChessDbStrFromBoard from "./getChessDbStrFromBoard";

import { improve } from "../chess-ml";

type Board = Array<Array<string>>;

interface Query {
  side: Side;
  board?: string;
  steps: number;
}

interface Move {
  from: [number, number];
  to: [number, number];
}

const getBoard = async (conn: Connection, side: Side, boardHash?: string) => {
  if (boardHash) return getBoardFromHash(boardHash);

  const chessMoveRepo = conn.getRepository(ChessMove);
  const chessMoves = await chessMoveRepo.find({
    relations: ["fromBoard"],
    where: [
      { qScore: MoreThan(100), side },
      { qScore: LessThan(-100), side },
    ],
    take: 100,
  });
  if (chessMoves.length) {
    // try updating move that are higher than 100
    // should have a lot of them in production database
    const index = Math.floor(Math.random() * chessMoves.length);
    const chessMove = chessMoves[index];
    return getBoardFromHash(chessMove.fromBoard.board);
  } else {
    // if none exist
    const chessMoves = await chessMoveRepo.find({
      relations: ["fromBoard"],
      where: { side },
    });
    const index = Math.floor(Math.random() * chessMoves.length);
    return getBoardFromHash(chessMoves[index].fromBoard.board);
  }
};

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
  const { board: boardHash, side, steps } = query;

  const board = await getBoard(connection, side, boardHash);
  const moves = await getMoves(board, side, steps);
  return improve(connection, {
    startBoard: board,
    botPlayerIsComp: false,
    topPlayerIsComp: false,
    moves,
  });
};

export default chessdb;
