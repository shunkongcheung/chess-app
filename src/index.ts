import "reflect-metadata";

import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { buildSchema } from "type-graphql";

import * as Resolvers from "./resolvers";
import getDbConnection from "./getDbConnection";

const start = async () => {
  // read .env file into process.env
  dotenv.config();

  const PORT = process.env.PORT;

  const app = express();
  const httpServer = http.createServer(app);

  await getDbConnection();

  // create apollo instance
  const schema = await buildSchema({
    resolvers: Object.values(Resolvers) as any,
  });
  const server = new ApolloServer({ schema });

  await server.start();

  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`🚀 Server ready at ${server.graphqlPath}`);
};

start();
