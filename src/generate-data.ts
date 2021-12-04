import getDbConnection from "./getDbConnection";
import insertNextBoardsAndMoves from "./services/insertNextBoardsAndMoves";

const start = async () => {
  const conn = await getDbConnection();

  let counter = 0;
  while (true) {
    console.log(`Running iteration ${counter++}`);
    await insertNextBoardsAndMoves(conn);
  }
};

start();

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT Ctrl-C) ");
  // some other closing procedures go here
  process.exit();
});
