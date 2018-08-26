import { messages, users } from "../models";
import uuidv4 from "uuid/v4";

export default {
  Query: {
    message: (parent, { id }) => messages[id],
    messages: (parent, { id }) => Object.values(messages)
  },
  Message: {
    user: message => users[message.userId]
  },
  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id
      };

      messages[id] = message;
      users[me.id].messageIds.push(id);

      return message;
    },
    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;

      if (!message) {
        return false;
      }

      return true;
    }
  }
};
