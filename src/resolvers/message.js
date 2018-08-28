import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, isMessageOwner } from "./authorization";

export default {
  Query: {
    message: async (parent, { id }, { models }) => {
      return await models.Message.findById(id);
    },
    messages: async (parent, { id }, { models }) => {
      return await models.Message.findAll();
    }
  },

  Message: {
    user: async (message, args, { models }) => {
      return await models.User.findById(message.userId);
    }
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated, // authenticate request
      async (parent, { text }, { me, models }) => {
        return await models.Message.create({
          text,
          userId: me.id
        });
      }
    ),
    deleteMessage: combineResolvers(
      isMessageOwner, // authorize request
      async (parent, { id }, { models }) => {
        return await models.Message.destroy({ where: { id } });
      }
    )
  }
};
