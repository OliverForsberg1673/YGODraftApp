import { Request, Response } from "express";
import { fetchAndCacheCards } from "../functions/cachefunction";

export const getRandomCards = async (_req: Request, res: Response) => {
  try {
    const cards = await fetchAndCacheCards();
    const shuffled = cards.sort(() => 0.5 - Math.random());
    res.json(shuffled.slice(0, 3));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
};
