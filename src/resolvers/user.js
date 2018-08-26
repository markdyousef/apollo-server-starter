import { users } from "../models";

export default {
  Query: {
    me: (parent, args, { me }) => me,
    user: (parent, { id }) => users[id],
    users: () => Object.values(users)
  },
  User: {
    messages: user => {
      return Object.valies(SAMPLE_MESSAGES).filter(
        message => message.userId === user.id
      );
    }
  }
};
