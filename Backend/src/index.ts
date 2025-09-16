import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cardsRouter from "./routes/cards";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/cards", cardsRouter);

const frontendPath = path.join(__dirname, "../../Frontend/dist");
app.use(express.static(frontendPath));

app.use((_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ Mongo connection error:", err));
