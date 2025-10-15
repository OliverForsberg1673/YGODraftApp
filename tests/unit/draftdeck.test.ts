import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import { Card } from "../../src/backend/types/cardformat";
import * as dbModule from "../../src/backend/functions/database";
import { generateDraftDeck } from "../../src/backend/functions/draftDeck";

let mongod: MongoMemoryServer;
let client: MongoClient;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  client = new MongoClient(uri);
  await client.connect();

  vi.spyOn(dbModule, "getDb").mockImplementation(async () => client.db());

  const cards: Card[] = [
    { id: 1, name: "Card A" },
    { id: 2, name: "Card B" },
    { id: 3, name: "Card C" },
    { id: 4, name: "Card D" },
    { id: 5, name: "Card E" },
  ];
  await client.db().collection<Card>("cards").insertMany(cards);
});

afterAll(async () => {
  await client.close();
  await mongod.stop();
});

describe("generateDraftDeck", () => {
  it("should generate 40 picks with 3 card options each", async () => {
    const draft = await generateDraftDeck();
    expect(draft.length).toBe(40);
    for (const pick of draft) {
      expect(pick.length).toBe(3);
      for (const card of pick) {
        expect(card).toHaveProperty("name");
        expect(card).toHaveProperty("id");
      }
    }
  });
});
