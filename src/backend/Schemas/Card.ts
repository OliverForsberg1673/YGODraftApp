import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  type: String,
  desc: String,
  atk: Number,
  def: Number,
  level: Number,
  race: String,
  attribute: String,
  card_images: [
    {
      id: Number,
      image_url: String,
      image_url_small: String,
      image_url_cropped: String,
    },
  ],
});

export const Card = mongoose.model("Card", cardSchema);
