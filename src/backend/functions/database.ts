import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/yugiohdraft";
const client = new MongoClient(uri);

let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db();
  }
  return db;
}
