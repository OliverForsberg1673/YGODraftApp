import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { MongoClient } from "mongodb";
import { generateDraftDeck } from "../src/backend/functions/draftDeck";
import { Card } from "../src/backend/types/cardformat";

const MONGO_URI = "mongodb://localhost:27017/ygodraft_test";
let client: MongoClient;

beforeAll(async () => {
  client = new MongoClient(MONGO_URI);
  await client.connect();

  const cardsCol = client.db().collection<Card>("cards");
  const count = await cardsCol.countDocuments();
  if (count === 0) {
    await cardsCol.insertOne({
      id: 1,
      name: "Test Card",
      type: "Monster",
      atk: 1000,
      def: 1000,
      level: 4,
      race: "Warrior",
      attribute: "LIGHT",
      card_images: [{ image_url: "", image_url_small: "" }],
    });
  }
});

afterAll(async () => {
  await client.db().dropDatabase();
  await client.close();
});

describe("Draft deck generation", () => {
  it("should have cards in the database", async () => {
    const count = await client.db().collection("cards").countDocuments();
    expect(count).toBeGreaterThan(0);
  });

  it("should generate a draft deck with 40 picks, each with 3 options", async () => {
    const draft = await generateDraftDeck();
    expect(Array.isArray(draft)).toBe(true);
    expect(draft.length).toBe(40);
    draft.forEach((pick) => {
      expect(Array.isArray(pick)).toBe(true);
      expect(pick.length).toBe(3);
      pick.forEach((card: Card) => {
        expect(card).toHaveProperty("name");
      });
    });
  });
});
