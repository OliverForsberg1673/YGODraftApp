import express from "express";
import {
  startDraft,
  getDraftOptions,
  pickCard,
} from "../functions/draftfunction";

const router = express.Router();

router.post("/start", async (req, res) => {
  try {
    const { userId } = req.body;
    const options = await startDraft(userId);
    res.json(options);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/options/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const options = await getDraftOptions(userId);
    res.json(options);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/pick", async (req, res) => {
  try {
    const { userId, cardId } = req.body;
    const result = await pickCard(userId, cardId);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
