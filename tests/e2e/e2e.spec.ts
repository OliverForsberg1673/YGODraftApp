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
});
