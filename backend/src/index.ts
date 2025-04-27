import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { schema } from "./graphql/schema";
import { PORT, MONGO_URI } from "./config";
import path from "path";
import fs from "fs";

dotenv.config();

async function loadInitialData(db: mongoose.Connection) {
  const collections = ['energyGroups', 'energyCategories', 'energyValues'];

  for (const collection of collections) {
    try {
      const count = await db.collection(collection).countDocuments();

      if (count === 0) {
        const filePath = path.join(process.cwd(), 'seed/2024', `${collection}.json`);
        if (fs.existsSync(filePath)) {
          let jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

          jsonData = jsonData.map((doc: any) => {
            if (doc.lastUpdate && doc.lastUpdate.$date) {
              doc.lastUpdate = new Date(doc.lastUpdate.$date);
            }
            if (doc.datetime && doc.datetime.$date) {
              doc.datetime = new Date(doc.datetime.$date);
            }
            
            return doc;
          });

          if (jsonData.length > 0) {
            await db.collection(collection).insertMany(jsonData, { ordered: false });
            console.log(`[DB]: ${jsonData.length} documents inserted on ${collection}`);
          }
        }
      } else {
        console.log(`[DB]: The collection ${collection} already contains ${count} documents.`);
      }
    } catch (error) {
      console.error(`[DB]: Error inserting on ${collection}:`, error);
    }
  }
}


async function main() {
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

    await loadInitialData(db);
    
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