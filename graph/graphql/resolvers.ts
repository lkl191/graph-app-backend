import Graph from "../models";
import admin from "../../Firebase-admin/admin";

module.exports = {
  Query: {
    async allGraphs() {
      try {
        //console.log(context.AuthContext)
        //const uid = checkAuth(context.AuthContext)
        //console.log(uid)
        const graphs = await Graph.find();
        return graphs;
      } catch (err) {
        console.log(err.message);
      }
    },
    async singleGraph(_: any, { graphId }: any, context: String) {
      //console.log(typeof(graphId))
      try {
        const graph = Graph.findById(graphId);
        return graph;
      } catch (err) {
        console.log(err.message);
      }
    },
    async myGraphs(_: any, { userId }: any, context: any) {
      let graphs;
      await admin
        .auth()
        .verifyIdToken(context.AuthContext)
        .then(async (user) => {
          graphs = await Graph.find({ userId: user.uid });
        });
      return await graphs;
    },
    async graphCate(_: any, { category }: any, context: any) {
      console.log(category);
      try {
        const graphs = Graph.find({ category: category });
        return graphs;
      } catch (err) {
        console.log(err.message);
      }
    },
  },
  Mutation: {
    async createGraph(
      _: any,
      { inputGraph: { title, category, graphKind, label, value } }: any,
      context: any
    ) {
      let data: any = [];

      for (let i = 0; i < label.length; i++) {
        data[i] = { label: label[i], value: value[i] };
      }
      console.log(data);
      await admin
        .auth()
        .verifyIdToken(context.AuthContext)
        .then((user) => {
          const userId = user.uid;

          let newGraph = new Graph({
            title,
            category,
            graphKind,
            userId,
            data,
          });
          const graph = newGraph.save();
          return graph;
        });
    },
    async deleteGraph(_: any, { inputDeleteGraph: { id } }: any, context: any) {
      //const user = await checkAuth(context.AuthContext);
      console.log("object");
      try {
        const graph = await Graph.findById(id);
        await graph.delete();
        console.log(graph);
        return "graph is deleted";
      } catch (err) {
        console.log(err.message);
      }
    },
  },
  //UserにGraphsを追加する
  User: {
    //userのIDが引数に入る
    graphs(props: any) {
      //console.log(graph)//ユーザIDは特定済み
      //これとGraphのuserIdを一致させたものを抽出したい
      const graph = Graph.find({ userId: props._id });
      //console.log(graph)
      //このgraphが格納されるのは[Graph]
      return graph;
    },
  },
  //Graph: {
  //  __resolveReference(graph: any) {
  //    return Graph.find((e: any) => e.id === graph);
  //  }
  //},
};
