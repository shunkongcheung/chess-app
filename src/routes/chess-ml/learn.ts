import brain from "brain.js";
import { Connection } from "typeorm";

import { getBoardFromHash } from "../../chess";
import { Side } from "../../constants";
import { ChessMlModel, ChessMove } from "../../entities";

const learn = async (connection: Connection) => {
  await Promise.all([
    trainForSide(connection, Side.Top),
    trainForSide(connection, Side.Bottom),
  ]);
};

const trainForSide = async (connection: Connection, side: Side) => {
  const net = new brain.NeuralNetwork();

  const exist = await connection.getRepository(ChessMlModel).findOne({ side });
  if (exist) net.fromJSON(JSON.parse(exist.netModel));

  const chessMoves = await connection.getRepository(ChessMove).find({
    where: { side },
    relations: ["fromBoard"],
  });

  if (side === Side.Bottom)
    console.log(`There are ${chessMoves.length} training data set for ...`);

  const datasets = chessMoves.map((chessMove) => ({
    input: {
      board: getBoardFromHash(chessMove.fromBoard.board),
      move: {
        from: [chessMove.fromRow, chessMove.fromCol],
        to: [chessMove.toRow, chessMove.toCol],
      },
    },
    output: chessMove.qScore,
  }));

  await net.trainAsync(datasets, {
    callback: ({ iterations }) => {
      if (iterations % 1000 === 0 && side === Side.Bottom)
        console.log(`Training for ${iterations} times..`);
    },
  });
  const netModel = JSON.stringify(net.toJSON());

  if (exist) {
    exist.netModel = netModel;
    await connection.getRepository(ChessMlModel).save(exist);
  } else {
    await connection.getRepository(ChessMlModel).save({ side, netModel });
  }
  console.log(`Training model for ${side} is stored.`);
};

export default learn;
