import { gql } from "apollo-server";

module.exports = gql`
  type Graph @key(fields: "id") @key(fields: "userId") {
    id: ID!
    title: String!
    category: String!
    graphKind: GraphKind!
    source: String
    userId: String
    data: [Data]
  }
  type Data {
    id: ID!
    label: String,
    value: Float
  }
  enum GraphKind {
    LINE
    BAR
    PIE
    RADAR
    SCATTER
  }
  input InputGraph {
    title: String!
    category: String!
    graphKind: GraphKind!
    source: String
    label: [String]
    value: [Float]
  }
  input InputDeleteGraph {
    id: ID!
  }
  type Mutation {
    createGraph(inputGraph: InputGraph): Graph
    deleteGraph(inputDeleteGraph: InputDeleteGraph): String
  }
  extend type Query {
    allGraphs: [Graph]
    singleGraph(graphId: ID!): Graph
    myGraphs(userId: String): [Graph]
    graphCate(category: String): [Graph]
  }
  extend type User @key(fields: "_id") {
    _id: String @external
    graphs: [Graph]
  }
`;
