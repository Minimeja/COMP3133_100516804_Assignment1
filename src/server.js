const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { validationResult } = require("express-validator");

const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const {
  userValidation,
  employeeValidation,
  runValidation
} = require("./utils/validation");

async function startServer() {
  await connectDB();

  const app = express();
  app.use(express.json({ limit: "10mb" }));

  const graphqlPath = "/graphql";

  app.use(graphqlPath, (req, res, next) => {
    const q = (req.body?.query || "").toLowerCase();

    if (q.includes("signup")) {
      return runValidation(userValidation)(req, res, next);
    }

    if (q.includes("addemployee") || q.includes("updateemployee")) {
      return runValidation(employeeValidation)(req, res, next);
    }

    return next();
  });

  app.use(graphqlPath, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((e) => ({
          message: e.msg,
          field: e.path
        }))
      });
    }
    next();
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();
  server.applyMiddleware({ app, path: graphqlPath });

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}${server.graphqlPath}`);
  });
}

startServer();