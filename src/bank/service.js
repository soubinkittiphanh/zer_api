// Import the Bank model
const logger = require('../api/logger');
const { Bank } = require('../models'); // Adjust this import according to your project structure

const bankService = {
  

  // Retrieve all banks
  getAllBanks: async (req, res) => {
    try {
      const banks = await Bank.findAll();
      res.status(200).json(banks);
    } catch (error) {
      logger.error(`Cannot retreive data with error ${error}`)
      res.status(500).json({ error: error.message });
    }
  },

  // Retrieve a single bank by id
  getBankById: async (req, res) => {
    try {
      const bank = await Bank.findByPk(req.params.id);
      if (!bank) {
        res.status(404).json({ error: 'Bank not found' });
      } else {
        res.status(200).json(bank);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


};

module.exports = bankService;
