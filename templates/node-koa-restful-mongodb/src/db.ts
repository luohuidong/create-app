import { MongoClient } from "mongodb";

const connectionString =
  (process.env.CONNECTION_STRING as string) || "mongodb://localhost:27017/test";

export const client = new MongoClient(connectionString);
export const db = client.db("test");

process.on("exit", () => {
  client.close();
});
