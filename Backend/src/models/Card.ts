import mongoose, { Schema, Document } from "mongoose";

export interface ICard extends Document {
  id: number;
  name: string;
  desc: string;
  card_images: { image_url: string }[];
}

const CardSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    desc: { type: String, required: true },
    card_images: { type: [{ image_url: String }], required: true },
  },
  { timestamps: true }
);

const Card = mongoose.model<ICard>("Card", CardSchema);

export default mongoose.model<ICard>("Card", CardSchema);
