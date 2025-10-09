import { describe, it, expect, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import { Card } from "../src/server/Schemas/Card";

const MONGO_URI = "mongodb://localhost:27017/ygodraft_test";

beforeAll(async () => {
  await mongoose.connect(MONGO_URI, { dbName: "ygodraft_test" });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe("Card Model (MongoDB)", () => {
  it("should save and retrieve a card", async () => {
    const testCard = new Card({
      id: 99999,
      name: "Test Card",
      type: "Monster",
      atk: 2500,
      def: 2000,
      level: 7,
      race: "Dragon",
      attribute: "DARK",
      card_images: [
        {
          id: 1,
          image_url: "http://example.com/image.jpg",
          image_url_small: "http://example.com/image_small.jpg",
          image_url_cropped: "http://example.com/image_cropped.jpg",
        },
      ],
    });

    await testCard.save();

    const found = await Card.findOne({ id: 99999 });
    expect(found).not.toBeNull();
    expect(found?.name).toBe("Test Card");
    expect(found?.atk).toBe(2500);
    expect(found?.card_images[0].image_url).toBe(
      "http://example.com/image.jpg"
    );
  });
});
