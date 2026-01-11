import express, { type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

app.get("/check", (req, res) => {
  res.status(201).json({ success: true, message: "Health check fine." });
});

const startServer = async () => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

startServer();
