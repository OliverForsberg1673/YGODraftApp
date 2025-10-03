import { describe, it, expect } from "vitest";

describe("Frontend fetch test", () => {
  it("should fetch random cards from backend", async () => {
    const response = await fetch("http://localhost:5000/api/cards/random");
    expect(response.ok).toBe(true);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(3);

    const card = data[0];
    expect(card).toHaveProperty("_id");
    expect(card).toHaveProperty("name");
    expect(card).toHaveProperty("card_images");
  });
});
