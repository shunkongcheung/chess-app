type Board = Array<Array<string>>;

const getHashFromBoard = (board: Board) =>
  board.map((row) => row.join("")).join("");

export default getHashFromBoard;
