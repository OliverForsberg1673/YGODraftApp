import express from "express";

import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

import { cacheCards } from "./functions/cacheCards.js";
import cardsRouter from "./routes/cards.js";
import draftRouter from "./routes/draft.js";
import decksRouter from "./routes/decks.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = "mongodb://127.0.0.1:27017/yugiohdraft";

async function startServer() {
  try {
    const app = express();
    app.use(express.json());
    console.log("MongoDB connected");

    await cacheCards();
    app.use("/api/decks", decksRouter);
    app.use("/api/cards", cardsRouter);
    app.use("/api/draft", draftRouter);

    const vite = await createViteServer({
      root: path.resolve(__dirname, "../frontend"),
      server: {
        middlewareMode: true,
        hmr: true,
      },
    });
    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const template = await vite.transformIndexHtml(
          url,
          path.resolve(__dirname, "../frontend/index.html")
        );
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server + Vite running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Server startup error:", err);
  }
}

startServer();
