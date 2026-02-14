const { prisma } = require("../config/prisma");
const { verifyAccessToken } = require("../utils/token");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Token version check (VERY IMPORTANT)
    if (decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({ message: "Token expired" });
    }

    req.user = user;

    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
