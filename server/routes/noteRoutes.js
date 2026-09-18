const express = require("express");
const mongoose = require("mongoose");
const Note = require("../models/Note");

const router = express.Router();

// POST /api/notes -> create a note, respond 201 Created with the saved note
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({ message: "Both title and content are required." });
    }

    const note = await Note.create({ title, content });
    return res.status(201).json(note);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error("POST /api/notes failed:", err);
    return res.status(500).json({ message: "Server error while creating note." });
  }
});

// GET /api/notes -> all notes, newest first
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    return res.status(200).json(notes);
  } catch (err) {
    console.error("GET /api/notes failed:", err);
    return res.status(500).json({ message: "Server error while fetching notes." });
  }
});

// DELETE /api/notes/:id -> 200 OK if deleted, 404 Not Found if absent
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // A malformed id can never match a document, so treat it as not found.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Note not found." });
    }

    const deleted = await Note.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.status(200).json({ message: "Note deleted.", id: deleted._id });
  } catch (err) {
    console.error("DELETE /api/notes/:id failed:", err);
    return res.status(500).json({ message: "Server error while deleting note." });
  }
});

module.exports = router;