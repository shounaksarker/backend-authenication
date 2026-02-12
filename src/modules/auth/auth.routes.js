const express = require("express");
const { signup, login, refresh, logout, getMe } = require("./auth.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { loginLimiter } = require("../../middlewares/rateLimiter.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", loginLimiter, login);
router.get("/me", authMiddleware, getMe);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
