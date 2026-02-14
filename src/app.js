const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const authRoutes = require("./modules/auth/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const { prisma } = require("./config/prisma");
const app = express();
require("dotenv").config();

app.use(helmet());
app.use(cors());
app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(errorMiddleware);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
  });
});
app.use("/api/v1/auth", authRoutes);

process.on("SIGTERM", async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;
