import { getDb } from "./database.js";
import { Card } from "../types/cardformat.js";

export interface DraftOption {
  id: number;
  name: string;
  type?: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  card_images?: {
    image_url?: string;
    image_url_small?: string;
  }[];
}

export async function generateDraftDeck(): Promise<Card[][]> {
  const db = await getDb();
  const allCards = await db.collection<Card>("cards").find().toArray();

  const draftPicks: Card[][] = [];
  for (let i = 0; i < 40; i++) {
    const options: Card[] = [];
    for (let j = 0; j < 3; j++) {
      const randomIndex = Math.floor(Math.random() * allCards.length);
      options.push(allCards[randomIndex]);
    }
    draftPicks.push(options);
  }
  return draftPicks;
}
