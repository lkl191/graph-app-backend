import { buildFederatedSchema } from "@apollo/federation";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { ApolloServer } from "apollo-server";
dotenv.config();

//graphql
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

//MongoDB
const MONGODB = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4002;

const server = new ApolloServer({
  schema: buildFederatedSchema({
    typeDefs,
    resolvers,
  }),
  context: ({ req }) => ({
    AuthContext: req.headers.authorization,
  }),
  //plugins: [ApolloServerPluginInlineTraceDisabled]
  //plugins: [ApolloServerPluginInlineTrace()],
});

if (!MONGODB) {
  console.log("not found MongoDB URI");
  process.exit(1)
}

mongoose
  .connect(MONGODB, {
    // useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: PORT as number })
  })
  .then((serverInfo) => {
    console.log(
      "🚀 Server ready at", serverInfo.url
    );
  })
  .catch((err) => {
    console.log(err);
  });
