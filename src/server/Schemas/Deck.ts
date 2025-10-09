import mongoose, { Schema, Document } from "mongoose";
import { DraftOption } from "../routes/draft.js";

export interface DeckDocument extends Document {
  cards: DraftOption[];
  createdAt: Date;
}

const DraftOptionSchema = new Schema<DraftOption>(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    type: String,
    atk: Number,
    def: Number,
    level: Number,
    race: String,
    attribute: String,
    card_images: [
      {
        image_url_small: String,
      },
    ],
  },
  { _id: false }
);

const DeckSchema = new Schema<DeckDocument>({
  cards: { type: [DraftOptionSchema], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Deck = mongoose.model<DeckDocument>("Deck", DeckSchema);
