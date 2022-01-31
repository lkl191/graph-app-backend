import { ApolloServer } from "apollo-server-express";
import { buildFederatedSchema } from "@apollo/federation";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const express = require("express");
// import * as fs from "fs";
// import * as https from "https";
import * as http from "http";

//graphql
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
// const crypt_key = process.env.CRYPT_KEY_PATH || "";
// const crypt_cert = process.env.CRYPT_CERT_PATH || "";

//MongoDB
let MONGODB = process.env.MONGODB_URI;
let port = process.env.PORT || 4001;

async function startApolloServer() {
  const configurations: any = {
    production: { ssl: true, port, hostname: "localhost" },
    development: { ssl: false, port, hostname: "localhost" },
  };

  const environment = process.env.NODE_ENV || "production";
  const config = configurations[environment];

  const server = new ApolloServer({
    schema: buildFederatedSchema({
      typeDefs,
      resolvers,
    }),
    context: ({ req }) => ({
      AuthContext: req.headers.authorization,
    }),
  });

  let httpServer: any;

  const serverStart = async () => {
    await server.start();
    const app = express();
    server.applyMiddleware({ app });
    httpServer = http.createServer(app);
  };
  if (!MONGODB) {
    return console.log("not found MongoDB URI");
  }
  mongoose
    .connect(MONGODB, {
      // useNewUrlParser: true,
      //useUnifiedTopology: true,
      //useCreateIndex: true,
    })
    .then(() => {
      console.log("MongoDB Connected");
      return serverStart();
    })
    .then(() => {
      new Promise((resolve) => httpServer.listen({ port }, resolve));
      console.log(
        "🚀 Server ready at",
        `http${config.ssl ? "s" : ""}://${config.hostname}:${config.port}${
          server.graphqlPath
        }`
      );
    })
    .catch((err) => {
      console.log(err);
    });
}

startApolloServer();

//server.listen(4001).then(({ url }: URL) => {
//    console.log(`Server has running on ${url}`)
//})
