import { ApolloGateway, RemoteGraphQLDataSource, ServiceEndpointDefinition } from "@apollo/gateway";
import * as dotenv from "dotenv";
import { ApolloServer } from "apollo-server";
dotenv.config();

const PORT = process.env.PORT || 4000;

const GRAPH_URL = process.env.GRAPH_URL
const USER_URL = process.env.USER_URL
const BLEND_GRAPH_URL = process.env.BLEND_GRAPH_URL

const services: ServiceEndpointDefinition[] = [
  { name: "graph", url: GRAPH_URL },
  { name: "user", url: USER_URL },
  { name: "blendGraph", url: BLEND_GRAPH_URL },
];

const gateway = new ApolloGateway({
  serviceList: services,
  //サブグラフごとに一回ずつ呼ばれる
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url, //サブグラフのURL
      //http-headerを付与して送信
      willSendRequest({ request, context }) {
        console.log(url);
        if(context.user && request.http) {
          const authContext = context.user.headers.authorization.split("Bearer ")[1];
          request.http.headers.set("authorization", authContext);
        }
      }
    });
  },
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  context: ({ req }) => {
    return { user: req }
  }
});

server.listen().then((serverInfo) => {
  console.log(
    "🚀 Server ready at",
    serverInfo.url
  );
})
