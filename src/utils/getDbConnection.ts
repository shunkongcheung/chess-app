import { createConnection, getConnectionManager } from "typeorm";

import * as Entities from "../entities";

const getDbConnection = async (logging?: boolean) => {
  const manager = getConnectionManager();
  const { NODE_ENV } = process.env;
  const isDev = NODE_ENV === "development";

  if (manager.has("default")) {
    const conn = manager.get("default");

    // in development, on hot reloading, registered entities will be removed
    // therefore, close the connection and create an new one
    if (isDev) {
      console.log("db: in development, close existing connection ...");
      await conn.close();
    }

    // in production, return as it is
    else {
      console.log("db: in production, return existing connection ...");
      return conn;
    }
  }

  // connection does not exists, create new one
  console.log("db: create connection ...");
  const connection = await createConnection({
    type: "postgres",
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    entities: Object.values(Entities),
    synchronize: true,
    logging: logging !== undefined ? logging : false,
  });
  return connection;
};

export default getDbConnection;
