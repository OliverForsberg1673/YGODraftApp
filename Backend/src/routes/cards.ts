import { Router } from "express";
import { getRandomCards } from "../controllers/cardsController";

const router = Router();
router.get("/random", getRandomCards);

export default router;
