import express from "express";
import { getDb } from "../functions/database.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  const db = await getDb();
  const decks = await db.collection("decks").find().toArray();
  res.json(decks);
});

router.put("/:id", async (req, res) => {
  const db = await getDb();
  const { id } = req.params;
  const { name, cards } = req.body;
  if (!name || !Array.isArray(cards)) {
    return res.status(400).json({ error: "Name and cards required" });
  }
  const result = await db
    .collection("decks")
    .updateOne({ _id: new ObjectId(id) }, { $set: { name, cards } });
  if (result.matchedCount === 0) {
    return res.status(404).json({ error: "Deck not found" });
  }
  res.json({ success: true });
});

router.post("/", async (req, res) => {
  console.log("POST /api/decks", req.body);
  const db = await getDb();
  const { name, cards } = req.body;
  if (!name || !Array.isArray(cards)) {
    return res.status(400).json({ error: "Name and cards required" });
  }
  const result = await db.collection("decks").insertOne({ name, cards });
  res.json({ _id: result.insertedId, name, cards });
});

router.get("/:id", async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const deck = await db
      .collection("decks")
      .findOne({ _id: new ObjectId(id) });
    if (!deck) return res.status(404).json({ error: "Deck not found" });
    res.json(deck);
  } catch (err) {
    res.status(400).json({ error: "Invalid deck ID" });
  }
});

router.delete("/:id", async (req, res) => {
  const db = await getDb();
  const { id } = req.params;
  await db.collection("decks").deleteOne({ _id: new ObjectId(id) });
  res.json({ success: true });
});

export default router;
