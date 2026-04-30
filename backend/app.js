const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route.js");
const taskRoutes = require("./routes/task.route.js");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

module.exports = app;
