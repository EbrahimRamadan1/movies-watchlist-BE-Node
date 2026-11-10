import { prisma } from "../config/db.js";

const addToWatchlist = async (req, res) => {
  const { movieId, notes, status, rating } = req.body;

  // Verify if movie exists
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found!" });
  }

  // Check if movie already added

  const existingInWatchlist = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (existingInWatchlist) {
    return res.status(400).json({ error: "Movie already on the watchlist!" });
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
    },
  });

  res.status(201).json({
    status: "Success",
    data: {
      watchlistItem,
    },
  });
};

const removeFromWatchlist = async (req, res) => {
  // Get movie using movie id
  const movie = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  if (!movie) {
    return res.status(400).json({ error: "Watchlist item not found!" });
  }

  // Ensure only  owner can remove
  if (movie.userId !== req.user.id) {
    return res
      .status(401)
      .json({ error: "Not allowed to remove this watchlist item" });
  }

  // Remove movie from watchlist
  await prisma.watchlistItem.delete({
    where: { id: req.params.id },
  });

  res.status(200).json({
    status: "Success",
    data: { message: "Movie removed successfully form your watchlist." },
  });
};

const updateWatchlistItems = async (req, res) => {
  const { movieId, notes, status, rating } = req.body;

  const movie = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  if (!movie) {
    return res.status(400).json({ error: "Watchlist item not found!" });
  }

  // Ensure only  owner can remove
  if (movie.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "Not allowed to update this watchlist item" });
  }

  const updatedData = {};
  if (status !== undefined) updatedData.status = status.toUpperCase();
  if (rating !== undefined) updatedData.rating = rating;
  if (notes !== undefined) updatedData.notes = notes;

  // Update watchlist item
  const updatedItem = await prisma.watchlistItem.update({
    where: { id: req.params.id },
    data: updatedData,
  });

  res.status(200).json({
    status: "success",
    data: {
      watchlistItem: updatedItem,
    },
  });
};

export { addToWatchlist, removeFromWatchlist, updateWatchlistItems };
