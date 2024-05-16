// Import the Account model
const logger = require('../api/logger');
const { Account } = require('../models'); // Adjust this import according to your project structure

const accountController = {
  // Create a new account
  createAccount: async (req, res) => {
    if (req.body.id) {
      logger.info(`Account id found -> go to update account`)
      return await updateAccount(req, res)
    }
    try {
      const account = await Account.create(req.body);
      res.status(201).json(account);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Retrieve all accounts
  getAllAccounts: async (req, res) => {
    try {
      const accounts = await Account.findAll({
        where: {
          isActive: true
        }
      });
      res.status(200).json(accounts);
    } catch (error) {
      logger.error(`Cannot retreive data with error ${error}`)
      res.status(500).json({ error: error.message });
    }
  },

  // Retrieve a single account by id
  getAccountById: async (req, res) => {
    try {
      const account = await Account.findByPk(req.params.id);
      if (!account) {
        res.status(404).json({ error: 'Account not found' });
      } else {
        res.status(200).json(account);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update an account
  updateAccount: async (req, res) => {
    try {
      const account = await Account.findByPk(req.params.id);
      if (!account) {
        res.status(404).json({ error: 'Account not found' });
      } else {
        const updatedAccount = await account.update(req.body);
        res.status(200).json(updatedAccount);
      }
    } catch (error) {
      logger.error(`cannot update account with error ${error}`)
      res.status(400).json({ error: error.message });
    }
  },

  // Delete an account
  deleteAccount: async (req, res) => {
    try {
      const account = await Account.findByPk(req.params.id);
      if (!account) {
        res.status(404).json({ error: 'Account not found' });
      } else {
        await account.destroy();
        res.status(204).send();
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = accountController;
