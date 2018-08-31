import http from "http";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import jwt from "jsonwebtoken";

import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";

const { PORT } = process.env;

const app = express();
app.use(cors());

// validate token session
const getMe = async req => {
  const token = req.headers["x-token"];
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError("Your session expired. Sign in again.");
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req, connection }) => {
    // subscriptions comes with a connection object
    if (connection) {
      return { models };
    }
    if (req) {
      const me = await getMe(req);
      return {
        models,
        secret: process.env.SECRET,
        me
      };
    }
  }
});

server.applyMiddleware({ app, path: "/graphql" });

// setup for exposing subscriptions
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// seed database with sample data
const createUsersWithMessages = async date => {
  await models.User.create(
    {
      username: "markdyousef",
      email: "markdyousef@gmail.com",
      password: "12345678",
      role: "ADMIN",
      messages: [
        {
          text: "The beauty of Mathematics",
          createdAt: date.setSeconds(date.getSeconds() + 1)
        }
      ]
    },
    {
      include: [models.Message]
    }
  );

  await models.User.create(
    {
      username: "andrewyousef",
      email: "andrewyousef@outlook.com",
      password: "12345678",
      messages: [
        {
          text: "Strategic Management",
          createdAt: date.setSeconds(date.getSeconds() + 1)
        }
      ]
    },
    {
      include: [models.Message]
    }
  );
};

const eraseDatabaseOnSync = true;

// sync database, then start server
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages(new Date());
  }
  httpServer.listen({ port: PORT }, () => {
    console.log(`Apollo Server on port: ${PORT}`);
  });
});
