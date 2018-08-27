import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";

import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";

const { PORT } = process.env;

const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async () => ({
    models,
    me: await models.User.findByLogin("markdyousef") // user is read async from database -> async context
  })
});

server.applyMiddleware({ app, path: "/graphql" });

// seed database with sample data
const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: "markdyousef",
      messages: [
        {
          text: "The beauty of Mathematics"
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
      messages: [
        {
          text: "Strategic Management"
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
    createUsersWithMessages();
  }
  app.listen({ port: PORT }, () => {
    console.log(`Apollo Server on port: ${PORT}`);
  });
});
