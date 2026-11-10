import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import { connectDb, disConnectDb } from "./config/db.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import MovieRoutes from "./routes/MovieRoutes.js";
import WatchListRoutes from "./routes/WatchlistRoutes.js";

config();
connectDb();
const app = express();

// Body parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/movies", MovieRoutes);
app.use("/auth", AuthRoutes);
app.use("/watchlist", WatchListRoutes);

const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejection (e.g., Database connection error)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection: ", err);
  server.close(async () => {
    await disConnectDb();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(async () => {
    await disConnectDb();
    process.exit(1);
  });
});

// Graceful Shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, Shutting down gracefully.");
  server.close(async () => {
    await disConnectDb();
    process.exit(0);
  });
});
