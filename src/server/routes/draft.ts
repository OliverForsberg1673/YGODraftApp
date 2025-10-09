import express from "express";
import { Card } from "../Schemas/Card.js";
import { Deck } from "../Schemas/Deck.js";

export interface DraftOption {
  id: number;
  name: string;
  type?: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  card_images?: { image_url_small?: string }[];
}

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allCards = await Card.find().lean();
    const draft: DraftOption[][] = [];

    for (let i = 0; i < 40; i++) {
      const pickOptions: DraftOption[] = [];
      for (let j = 0; j < 3; j++) {
        const card = allCards[Math.floor(Math.random() * allCards.length)];
        pickOptions.push({
          id: card.id,
          name: card.name,
          type: card.type,
          atk: card.atk,
          def: card.def,
          level: card.level,
          race: card.race,
          attribute: card.attribute,
          card_images: card.card_images?.map((img) => ({
            image_url_small: img.image_url_small,
          })),
        });
      }
      draft.push(pickOptions);
    }

    const deckToSave = draft.map((options) => options[0]);
    const newDeck = new Deck({ cards: deckToSave });
    await newDeck.save();
    console.log("Deck saved to MongoDB");

    res.json({ draft });
  } catch (err) {
    console.error("Failed to generate draft:", err);
    res.status(500).json({ error: "Failed to generate draft" });
  }
});

export default router;
