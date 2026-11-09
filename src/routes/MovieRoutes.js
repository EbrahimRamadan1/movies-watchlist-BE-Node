import express from "express";

const router = express.Router();

router.get("/hello", (req, res) => {
  res.json({ message: "get!" });
});

router.post("/hello", (req, res) => {
  res.json({ message: "post" });
});

router.put("/hello", (req, res) => {
  res.json({ message: "put" });
});

router.delete("/hello", (req, res) => {
  res.json({ message: "delete" });
});

export default router;
