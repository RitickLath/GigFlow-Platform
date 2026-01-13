import dotenv from "dotenv";
// Load environment variables FIRST, before any other imports
dotenv.config();

import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB, disconnectDB } from "./config/server.config.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

app.use("/api/v1", routes);

// Global Error handler (Custom, DB, Unhandled)
app.use(errorHandler);

let server: ReturnType<typeof app.listen>;

const startServer = async () => {
  const isConnected = await connectDB();

  if (!isConnected) {
    console.error("Failed to connect to database. Exiting...");
    process.exit(1);
  }

  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

const gracefulShutdown = async (signal: string) => {
  console.log(`\n  ${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(() => {
      console.log("HTTP server closed");
    });
  }

  await disconnectDB();

  console.log("Graceful shutdown complete");
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

startServer();
