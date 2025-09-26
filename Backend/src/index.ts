import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cardsRouter from "./routes/cards";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/cards", cardsRouter);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/ygodraft")
  .then(() => {
    console.log(" MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error(" Mongo connection error:", err));
