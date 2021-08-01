
/*
import { ApolloServer } from "apollo-server";
import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";

interface URL {
  url: String;
}

const servises = [
  { name: "graph", url: "http://localhost:4001" },
  { name: "user", url: "http://localhost:4002" },
];

const gateway = new ApolloGateway({
  serviceList: servises,
  //サブグラフごとに一回ずつ呼ぶ
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url, //サブグラフのURL
      //http-headerを付与して送信
      willSendRequest({ request, context }: any) {
        try {
          console.log(url);
          const authContext =
            context.user.headers.authorization.split("Bearer ")[1];

          //console.log(authContext)
          request.http.headers.set("authorization", authContext);
        } catch {
          console.log("headersが見つからない");
        }
      },
    });
  },
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  //各サブグラフへ

  context: ({ req }) => {
    return req;
  },
});

server.listen(4000).then(({ url }: URL) => {
  console.log(`Server has running on ${url}`);
});
*/

//import * as express from "express";
const express = require("express")
import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';
import * as dotenv from "dotenv"
dotenv.config()


async function startApolloServer() {
  const configurations: any = {
    // Note: You may need sudo to run on port 443
    production: { ssl: true, port: 4443, hostname: 'genbu.shishin.nara.jp' },
    development: { ssl: false, port: 4000, hostname: 'localhost' },
  };

  const environment = process.env.NODE_ENV || 'production';
  const config = configurations[environment];

  const servises = [
    { name: "graph", url: "http://localhost:4001" },
    { name: "user", url: "http://localhost:4002" },
  ];

  const gateway = new ApolloGateway({
    serviceList: servises,
    //サブグラフごとに一回ずつ呼ぶ
    buildService({ name, url }) {
      return new RemoteGraphQLDataSource({
        url, //サブグラフのURL
        //http-headerを付与して送信
        willSendRequest({ request, context }: any) {
          try {
            console.log(url);
            const authContext =
              context.user.headers.authorization.split("Bearer ")[1];
  
            //console.log(authContext)
            request.http.headers.set("authorization", authContext);
          } catch {
            console.log("headersが見つからない");
          }
        },
      });
    },
  });

  const server = new ApolloServer({
    gateway,
    subscriptions: false,
    //各サブグラフへ
  
    context: ({ req }) => {
      return req;
    },
  });
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  // Create the HTTPS or HTTP server, per configuration
  let httpServer: any;
  if (config.ssl) {
    // Assumes certificates are in a .ssl folder off of the package root.
    // Make sure these files are secured.
    httpServer = https.createServer(
      {
        key: fs.readFileSync(`./ssl/server_key.pem`),//キー
        cert: fs.readFileSync(`./ssl/server_crt.pem`)//証明書
      },
      app,
    );
  } else {
    httpServer = http.createServer(app);
  }

  await new Promise(resolve => httpServer.listen({ port: config.port }, resolve));
  console.log(
    '🚀 Server ready at',
    `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${server.graphqlPath}`
  );
  return { server, app };
}

startApolloServer()
