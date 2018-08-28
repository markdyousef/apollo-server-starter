import bcrypt from "bcrypt";

const generatePasswordHash = async password => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export default (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42]
      }
    },
    role: {
      type: DataTypes.STRING
    }
  });

  // associate with Messages
  User.associate = models => {
    User.hasMany(models.Message);
  };

  User.findByLogin = async login => {
    let user = await User.findOne({
      where: { username: login }
    });

    if (!user) {
      user = await User.findOne({
        where: { email: login }
      });
    }
    return user;
  };

  // hook function to encrypt password
  User.beforeCreate(async user => {
    user.password = await generatePasswordHash(user.password);
  });

  // use prototypal inheritance to make user.password available
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};
