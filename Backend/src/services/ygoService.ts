import axios from "axios";
import Card, { ICard } from "../models/Card";
import { YGOCard, YGOCardsResponse } from "../types/YGO";

export const fetchAndCacheCards = async (): Promise<ICard[]> => {
  let cards: ICard[] = await Card.find();

  if (cards.length === 0) {
    console.log("⚡ Fetching cards from YGOPRODeck API...");

    const response = await axios.get<YGOCardsResponse>(
      "https://db.ygoprodeck.com/api/v7/cardinfo.php"
    );

    const fetchedCards: YGOCard[] = response.data.data;

    // Cache in MongoDB
    cards = (await Card.insertMany(
      fetchedCards.map((c) => ({
        id: c.id,
        name: c.name,
        desc: c.desc,
        card_images: c.card_images,
      })),
      { ordered: false } // skip duplicates
    )) as ICard[];

    console.log("✅ Cards cached in MongoDB");
  }

  return cards;
};
