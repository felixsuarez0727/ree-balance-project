// src/index.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { schema } from "./graphql/schema";
import { PORT, MONGO_URI } from "./config";

dotenv.config();

// Función principal
async function main() {
  // Inicializar Express
  const app = express();
  const port = PORT;
  
  // Middlewares 
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Base route
  app.get("/", (_req, res) => {
    res.json({ message: "API working correctly" });
  });
  
  try {
    console.log("[MongoDB]: Starting connection to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      connectTimeoutMS: 10000,
    });
    console.log("[MongoDB]: Connected successfully");

    const db = mongoose.connection.useDb("ree-balance");
    console.log(`[MongoDB]: Using database ${db.name}`);
    
    const apolloServer = new ApolloServer({
      schema,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    });
    
    await apolloServer.start();
    
    const graphqlHandler = expressMiddleware(apolloServer);
    app.use('/graphql', cors(), express.json(), graphqlHandler);
    
    app.listen(port, "0.0.0.0", () => {
      console.log(`[Server]: Server running on http://localhost:${port}`);
      console.log(`[GraphQL]: GraphQL endpoint available at http://localhost:${port}/graphql`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

main();