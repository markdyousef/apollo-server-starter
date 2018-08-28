const createToken = async user => {
  return null;
};

export default {
  Query: {
    me: async (parent, args, { me }, { models }) => {
      return await models.User.findById(me.id);
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findById(id);
    },
    users: async (parent, args, { models }) => {
      return await models.User.findAll();
    }
  },
  Mutation: {
    signUp: async (parent, { username, email, password }, { models }) => {
      const users = await models.User.create({
        username,
        email,
        password
      });

      return { token: createToken(user) };
    }
  },

  User: {
    messages: async (user, args, { models }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id
        }
      });
    }
  }
};
