const User = require("../../models/User");
const { hashPassword, comparePassword, signToken } = require("../../utils/auth");

const userResolvers = {
  Query: {
    login: async (_, { username, email, password }) => {
      if (!password) throw new Error("Password is required");
      if (!username && !email) throw new Error("Username or email is required");

      const user = await User.findOne({
        $or: [{ username }, { email }]
      });

      if (!user) throw new Error("Invalid credentials");

      const ok = await comparePassword(password, user.password);
      if (!ok) throw new Error("Invalid credentials");

      return signToken({ userId: user._id, username: user.username, email: user.email });
    }
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      if (!username || !email || !password) throw new Error("All fields are required");

      const existing = await User.findOne({ $or: [{ username }, { email }] });
      if (existing) throw new Error("Username or email already exists");

      const hashed = await hashPassword(password);

      const user = await User.create({
        username,
        email,
        password: hashed
      });

      return user;
    }
  }
};

module.exports = userResolvers;
