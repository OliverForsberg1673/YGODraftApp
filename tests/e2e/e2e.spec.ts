import { test, expect } from "@playwright/test";

test("can draft and save a deck, then view it", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.waitForSelector("#draft-container .card-option");

  for (let i = 0; i < 40; i++) {
    await page.click("#draft-container .card-option");
  }

  await page.fill("#final-deck-name", "Playwright Test Deck");
  await page.click('button[type="submit"]');

  await page.waitForURL("**/manage-decks");

  await expect(
    page.locator(".deck-link", { hasText: "Playwright Test Deck" }).first()
  ).toBeVisible();

  await page.click(".show-cards-btn");
  await expect(page.getByText("Playwright Test Deck")).toBeVisible();

  const decks = await page.evaluate(async () => {
    const res = await fetch("/api/decks");
    return await res.json();
  });

  const testDeck = decks.find((d: any) => d.name === "Playwright Test Deck");
  if (testDeck) {
    await page.evaluate(async (id) => {
      await fetch(`/api/decks/${id}`, { method: "DELETE" });
    }, testDeck._id);
  }
});
