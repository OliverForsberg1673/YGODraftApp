import express from "express";
import { generateDraftDeck } from "../functions/draftDeck.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const draft = await generateDraftDeck();
    res.json({ draft });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate draft" });
  }
});

router.post("/reset", async (req, res) => {
  try {
    const draft = await generateDraftDeck();
    res.json({ draft });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset draft" });
  }
});

export default router;
