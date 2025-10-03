import mongoose, { Schema, Document } from "mongoose";

export interface ICard extends Document {
  id: number;
  name: string;
  type?: string;
  desc?: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  archetype?: string;
  card_images?: { id: number; image_url: string }[];
  card_sets?: {
    set_name: string;
    set_code: string;
    set_rarity: string;
    set_rarity_code: string;
    set_price: string;
  }[];
  [key: string]: any;
}

const CardSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String },
    desc: { type: String },
    atk: { type: Number },
    def: { type: Number },
    level: { type: Number },
    race: { type: String },
    attribute: { type: String },
    archetype: { type: String },
    card_images: [
      {
        id: { type: Number },
        image_url: { type: String },
      },
    ],
    card_sets: [
      {
        set_name: { type: String },
        set_code: { type: String },
        set_rarity: { type: String },
        set_rarity_code: { type: String },
        set_price: { type: String },
      },
    ],
  },
  { timestamps: true, strict: false }
);

const Card = mongoose.models.Card || mongoose.model<ICard>("Card", CardSchema);
export default Card;
