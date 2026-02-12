const { v4: uuidv4 } = require("uuid");
const { prisma } = require("../../config/prisma");

const {
  findUserByEmail,
  createUser,
  createRefreshToken,
} = require("./auth.repository");

const { hashPassword, comparePassword } = require("../../utils/hash");

const {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} = require("../../utils/token");

const signupService = async (email, password) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser({
    id: uuidv4(),
    email,
    passwordHash,
  });

  return user;
};

const loginService = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.passwordHash);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
    tokenVersion: user.tokenVersion,
  });

  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  await createRefreshToken({
    id: uuidv4(),
    userId: user.id,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const refreshService = async (refreshToken) => {
  const hashedToken = hashRefreshToken(refreshToken);

  const existingToken = await prisma.refreshToken.findFirst({
    where: {
      tokenHash: hashedToken,
      isRevoked: false,
    },
  });

  if (!existingToken) {
    throw new Error("Invalid refresh token");
  }

  if (existingToken.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  const user = await prisma.user.findUnique({
    where: { id: existingToken.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Rotation: delete old token
  await prisma.refreshToken.delete({
    where: { id: existingToken.id },
  });

  const newRefreshToken = generateRefreshToken();
  const newHashedToken = hashRefreshToken(newRefreshToken);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: newHashedToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const newAccessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
    tokenVersion: user.tokenVersion,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logoutService = async (refreshToken) => {
  const hashedToken = hashRefreshToken(refreshToken);

  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashedToken },
    data: { isRevoked: true },
  });
};

module.exports = {
  signupService,
  loginService,
  refreshService,
  logoutService,
};
