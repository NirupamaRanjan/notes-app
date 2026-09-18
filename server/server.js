const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware must be mounted before the route handlers
app.use(cors()); // Permits cross-origin requests from http://localhost:5173
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Notes API is running. Use /api/notes." });
});
app.use("/api/notes", noteRoutes);

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.` });
});

// Connect to MongoDB first, then start listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});