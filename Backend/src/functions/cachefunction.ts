import axios from "axios";
import Card, { ICard } from "../Schemas/Card";
import { YGOCard } from "../types/YGO";

interface YGOCardsResponse {
  data: Record<string, YGOCard>;
}

export const fetchAndCacheCards = async (): Promise<ICard[]> => {
  try {
    const count = await Card.countDocuments();
    if (count > 0) {
      console.log(`Found ${count} cached cards in MongoDB`);
      return (await Card.find()) as ICard[];
    }

    console.log(" Fetching cards from YGOPRODeck API...");

    const response = await axios.get<YGOCardsResponse>(
      "https://db.ygoprodeck.com/api/v7/cardinfo.php"
    );

    const apiData = response.data?.data;
    if (!apiData) {
      console.error(" API response missing 'data'");
      console.log("Full response:", response.data);
      return [];
    }

    const cardsArray = Object.values(apiData) as YGOCard[];
    const inserted = (await Card.insertMany(cardsArray, {
      ordered: false,
    })) as ICard[];

    console.log(` Saved ${inserted.length} cards into MongoDB`);
    return inserted;
  } catch (err: any) {
    console.error(" Error fetching/caching cards:", err.message || err);
    return [];
  }
};
