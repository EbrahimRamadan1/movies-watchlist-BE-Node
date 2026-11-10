import express from "express";
import {
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItems,
} from "../controllers/watchlistController.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addToWatchlist);
router.delete("/:id", removeFromWatchlist);
router.put("/:id", updateWatchlistItems);

export default router;
