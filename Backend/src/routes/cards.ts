import { Router } from "express";
import { getRandomCards } from "../controllers/cardsController";

const router = Router();

// GET /api/cards/random
router.get("/random", getRandomCards);

export default router;
