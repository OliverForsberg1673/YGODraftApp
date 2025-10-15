import { getDb } from "./database.js";
import { Card } from "../types/cardformat.js";

export async function cacheCards() {
  const db = await getDb();
  const cardsCollection = db.collection<Card>("cards");

  const count = await cardsCollection.countDocuments();
  if (count > 0) {
    console.log("Cards already cached in MongoDB.");
    return;
  }

  const response = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
  if (!response.ok) {
    throw new Error("Failed to fetch cards from ygoprodeck API");
  }
  const data = await response.json();
  const cards: Card[] = data.data;

  await cardsCollection.insertMany(cards);
  console.log(`Cached ${cards.length} cards to MongoDB from ygoprodeck API.`);
}
