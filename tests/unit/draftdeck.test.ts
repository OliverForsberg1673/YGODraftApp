import { describe, it, expect } from "vitest";
import { generateDraftDeck } from "../../src/backend/functions/draftDeck";

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
