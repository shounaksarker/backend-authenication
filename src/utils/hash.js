const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

const hashPassword = async (plainPassword) => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

const comparePassword = async (plainPassword, hash) => {
  return bcrypt.compare(plainPassword, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};
