import { Card } from "../Schemas/Card.js";

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

export async function generateDraftDeck(): Promise<DraftOption[][]> {
  const allCards = await Card.find();

  if (allCards.length === 0) {
    throw new Error("No cards available in the database.");
  }

  const draftPicks: DraftOption[][] = [];

  for (let i = 0; i < 40; i++) {
    const options: DraftOption[] = [];
    for (let j = 0; j < 3; j++) {
      const randomCard = allCards[Math.floor(Math.random() * allCards.length)];
      options.push({
        id: randomCard.id,
        name: randomCard.name,
        type: randomCard.type,
        atk: randomCard.atk,
        def: randomCard.def,
        level: randomCard.level,
        race: randomCard.race,
        attribute: randomCard.attribute,
        card_images: randomCard.card_images,
      });
    }
    draftPicks.push(options);
  }

  return draftPicks;
}
