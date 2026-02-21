const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

async function startServer() {
  await connectDB();

  const app = express();
  app.use(express.json({ limit: "10mb" }));

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();
  server.applyMiddleware({ app });

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}${server.graphqlPath}`);
  });
}

startServer();