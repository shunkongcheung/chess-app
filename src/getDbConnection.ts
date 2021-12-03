import { createConnection, getConnectionManager, Connection } from "typeorm";
import dotenv from "dotenv";

import * as Entities from "./entities";

const getDbConnection = async () => {
  // read .env file into process.env
  dotenv.config();

  // to connect using configuation file
  const connectionManager = getConnectionManager();
  const connection: Connection = connectionManager.create({
    type: process.env.TYPEORM_CONNECTION as any,
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: Object.values(Entities),
    logging: true,
  });

  await connection.connect();
  await connection.synchronize(); 

  return connection;
};

export default getDbConnection;
