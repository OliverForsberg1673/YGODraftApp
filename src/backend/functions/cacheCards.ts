import { getDb } from "./database.js";
import { Card } from "../types/cardformat.js";
import fs from "fs/promises";
import path from "path";

export async function cacheCards() {
  const db = await getDb();
  const cardsCollection = db.collection<Card>("cards");

  const count = await cardsCollection.countDocuments();
  if (count > 0) {
    console.log("Cards already cached in MongoDB.");
    return;
  }

  const cardsPath = path.resolve(process.cwd(), "cards.json");
  const data = await fs.readFile(cardsPath, "utf-8");
  const cards: Card[] = JSON.parse(data);

  await cardsCollection.insertMany(cards);
  console.log(`Cached ${cards.length} cards to MongoDB.`);
}
