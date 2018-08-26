import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer, gql } from "apollo-server-express";

const { PORT } = process.env;

const app = express();
app.use(cors());

const schema = gql`
  type Query {
    me: User
  }

  type User {
    username: String!
  }
`;
const resolvers = {
  Query: {
    me: () => {
      return {
        username: "Mark Yousef"
      };
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: PORT }, () => {
  console.log(`Apollo Server on port: ${PORT}`);
});
