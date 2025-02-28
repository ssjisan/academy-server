const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12); // No need for callback, async/await handles it
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw error;
  }
};

const comparePassword = async (password, hashed) => {
  try {
    const isMatch = await bcrypt.compare(password, hashed);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

module.exports = { hashPassword, comparePassword };
