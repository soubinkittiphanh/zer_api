// Import the FundsTransfer model
const { removeComma } = require('../api/common');
const logger = require('../api/logger');
const { FundsTransfer, Member, Bank, Account } = require('../models'); // Adjust this import according to your project structure
const accountService = require('../account/service');
const { Op } = require('sequelize');

const fundsTransferController = {
    // Create a new FundsTransfer entry
    createFundsTransfer: async (req, res) => {
        try {
            if (String(req.body.amount).includes(",")) {
                req.body.amount = removeComma(req.body.amount, ",", "");
            }
            const fundsTransfer = await FundsTransfer.create(req.body);
            res.status(201).json(fundsTransfer);
        } catch (error) {
            logger.error(`cannot create ft with error ${error}`)
            res.status(400).json({ error: error.message });
        }
    },

    // Retrieve all FundsTransfer entries
    getAllFundsTransfers: async (req, res) => {
        try {
            const fundsTransfers = await FundsTransfer.findAll();
            res.status(200).json(fundsTransfers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Retrieve all FundsTransfer entries
    getAllFundsTransfersInactive: async (req, res) => {
        try {
            const fundsTransfers = await FundsTransfer.findAll({
                where: {
                    isActive: false
                },
                include: ['inputter', 'authorisor',
                    {
                        model: Account,
                        as: "account",
                        include: ['bank', 'member']
                    }]
            });
            res.status(200).json(fundsTransfers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllFundsTransfersInactiveByDate: async (req, res) => {
        const { startDate, endDate } = JSON.parse(req.query.date);
        logger.warn(`DATE QURY FROM ${startDate} ${endDate}`)
        try {
            const fundsTransfers = await FundsTransfer.findAll({
                where: {
                    isActive: false,
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                include: ['inputter', 'authorisor',
                    {
                        model: Account,
                        as: "account",
                        include: ['bank', 'member']
                    }]
            });
            res.status(200).json(fundsTransfers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllFundsTransferAccountIdByDate: async (req, res) => {
        const { startDate, endDate, accountNumber } = JSON.parse(req.query.date);
        logger.warn(`DATE QURY FROM ${startDate} ${endDate}`)
        try {
            let fundsTransfers = null;
            if (accountNumber) {
                const account = await accountService.getAllAccountsByAccountNumber(accountNumber)
                fundsTransfers = await FundsTransfer.findAll({
                    where: {
                        createdAt: {
                            [Op.between]: [startDate, endDate]
                        },
                        accountId: account.id,
                    },
                    include: ['inputter', 'authorisor',
                        {
                            model: Account,
                            as: "account",
                            include: ['bank', 'member']
                        }]
                });
            } else {
                fundsTransfers = await FundsTransfer.findAll({
                    where: {
                        createdAt: {
                            [Op.between]: [startDate, endDate]
                        },
                    },
                    include: ['inputter', 'authorisor',
                        {
                            model: Account,
                            as: "account",
                            include: ['bank', 'member']
                        }]
                });
            }

            res.status(200).json(fundsTransfers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Retrieve all FundsTransfer entries
    getAllFundsTransfersByMemberId: async (req, res) => {
        const accounts = await accountService.getAllAccountsByMemberIdService(req.params.memberId)
        try {
            const fundsTransfers = await FundsTransfer.findAll({
                where: {
                    'accountId': {
                        [Op.in]: accounts.map(account => account.id)

                    },
                },
                include: ['account']
            });
            res.status(200).json(fundsTransfers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Retrieve a single FundsTransfer by id
    getFundsTransferById: async (req, res) => {
        try {
            const fundsTransfer = await FundsTransfer.findByPk(req.params.id);
            if (!fundsTransfer) {
                res.status(404).json({ error: 'FundsTransfer not found' });
            } else {
                res.status(200).json(fundsTransfer);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a FundsTransfer entry
    updateFundsTransfer: async (req, res) => {
        try {
            const fundsTransfer = await FundsTransfer.findByPk(req.params.id);
            if (!fundsTransfer) {
                res.status(404).json({ error: 'FundsTransfer not found' });
            } else {
                const updatedFundsTransfer = await fundsTransfer.update(req.body);
                res.status(200).json(updatedFundsTransfer);
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete a FundsTransfer entry
    deleteFundsTransfer: async (req, res) => {
        try {
            const fundsTransfer = await FundsTransfer.findByPk(req.params.id);
            if (!fundsTransfer) {
                res.status(404).json({ error: 'FundsTransfer not found' });
            } else {
                await fundsTransfer.destroy();
                res.status(204).send();
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = fundsTransferController;
