import { ApolloServer } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import * as mongoose from "mongoose";
import { ApolloServerPluginInlineTrace } from "apollo-server-core/dist/plugin/inlineTrace";
import * as dotenv from "dotenv"

dotenv.config()

//graphql
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

//MongoDB

//.envはyarn startを実行する場所に置く
let MONGODB: any = process.env.MONGODB_URI
let port = process.env.PORT || 4002;

const server = new ApolloServer({
  schema: buildFederatedSchema({
    typeDefs,
    resolvers,
  }),
  context: ({ req }) => ({
    AuthContext: req.headers.authorization
  }),
  plugins: [ApolloServerPluginInlineTrace()],
});

//admin
//  .initializeApp()
//  .auth()
//  .verifyIdToken(idToken)
//  .then((decodedToken) => {
//    const uid = decodedToken.uid;
//    console.log(uid)
//  })
//  .catch((error) => {
//    console.log(error.message);
//  });

interface URL {
  url: String;
}

mongoose
  .connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port });
  })
  .then(({ url }: URL) => {
    console.log(`Server has running on ${url}`);
  });

//server.listen(4002).then(({url}: URL) => {
//    console.log(`Server has running on ${url}`)
//})
