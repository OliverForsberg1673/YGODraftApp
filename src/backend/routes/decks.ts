import express from "express";
import { getDb } from "../functions/database.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  const db = await getDb();
  const decks = await db.collection("decks").find().toArray();
  res.json(decks);
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

router.put("/:id", async (req, res) => {
  const db = await getDb();
  const { id } = req.params;
  const { name, cards } = req.body;
  const result = await db
    .collection("decks")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, cards } },
      { returnDocument: "after" }
    );
  res.json(result.value);
});

router.delete("/:id", async (req, res) => {
  const db = await getDb();
  const { id } = req.params;
  await db.collection("decks").deleteOne({ _id: new ObjectId(id) });
  res.json({ success: true });
});

export default router;
