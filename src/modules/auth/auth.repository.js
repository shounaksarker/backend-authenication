const { prisma } = require("../../config/prisma");

const findUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const createUser = (data) => {
  return prisma.user.create({
    data,
  });
};

const createRefreshToken = (data) => {
  return prisma.refreshToken.create({
    data,
  });
};

module.exports = {
  findUserByEmail,
  createUser,
  createRefreshToken,
};
