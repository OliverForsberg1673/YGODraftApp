import fetch from "node-fetch";
import { Card } from "../Schemas/Card.js";

interface YGOCardImage {
  id?: number;
  image_url?: string;
  image_url_small?: string;
  image_url_cropped?: string;
}

interface YGOCard {
  id: number;
  name: string;
  type?: string;
  desc?: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  card_images?: YGOCardImage[];
}

interface YGOAPIResponse {
  data: YGOCard[];
}

export async function cacheCards() {
  const existing = await Card.countDocuments();
  if (existing > 0) {
    console.log("Cards already cached in MongoDB");
    return;
  }

  console.log("Fetching cards from YGOPRODeck API");
  const response = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
  const json = await response.json();
  const data = json as YGOAPIResponse;
  const cardsArray = data.data;

  console.log(`💾 Inserting ${cardsArray.length} cards into MongoDB...`);

  const cardsToInsert = cardsArray.map((card) => ({
    id: card.id,
    name: card.name,
    type: card.type,
    atk: card.atk,
    def: card.def,
    level: card.level,
    race: card.race,
    attribute: card.attribute,
    card_images: card.card_images?.map((img) => ({
      image_url: img.image_url,
      image_url_small: img.image_url_small,
    })),
  }));

  await Card.insertMany(cardsToInsert);

  console.log("All cards cached successfully");
}
