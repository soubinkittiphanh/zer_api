const bcrypt = require('bcrypt');

const saltRounds = 10; // You can adjust the salt rounds as needed

const bcryptService = {
  /**
   * Hash a plaintext password.
   * @param {string} password - The plaintext password to hash.
   * @returns {Promise<string>} The hashed password.
   */
  hashPassword: async (password) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      throw new Error('Error hashing password');
    }
  },

  /**
   * Compare a plaintext password with a hashed password.
   * @param {string} password - The plaintext password.
   * @param {string} hash - The hashed password.
   * @returns {Promise<boolean>} A boolean indicating if the passwords match.
   */
  comparePassword: async (password, hash) => {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error('Error comparing password');
    }
  }
};

module.exports = bcryptService;
