import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer, gql } from "apollo-server-express";

const SAMPLE_USERS = {
  1: {
    id: "1",
    username: "Mark Yousef",
    messageId: ["1"]
  },
  2: {
    id: "2",
    username: "Andrew Yousef",
    messageId: ["2"]
  }
};

const SAMPLE_MESSAGES = {
  1: {
    id: "1",
    text: "Hello World",
    userId: "1"
  },
  2: {
    id: "2",
    text: "Bye World",
    userId: "2"
  }
};

const { PORT } = process.env;

const app = express();
app.use(cors());

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]

    messages: [Message!]!
    message(id: ID!): Message!
  }

  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;
const resolvers = {
  Query: {
    me: (parent, args, { me }) => me,
    user: (parent, { id }) => SAMPLE_USERS[id],
    users: () => Object.values(SAMPLE_USERS),
    message: (parent, { id }) => SAMPLE_MESSAGES[id],
    messages: (parent, { id }) => Object.values(SAMPLE_MESSAGES)
  },
  User: {
    messages: user => {
      return Object.valies(SAMPLE_MESSAGES).filter(
        message => message.userId === user.id
      );
    }
  },
  Message: {
    user: message => SAMPLE_USERS[message.userId]
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: SAMPLE_USERS[1]
  }
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: PORT }, () => {
  console.log(`Apollo Server on port: ${PORT}`);
});
