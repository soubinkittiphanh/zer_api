// Import the Account model
const logger = require('../api/logger');
const { Account } = require('../models'); // Adjust this import according to your project structure


const getAllAccountsByMemberId = async (req, res) => {
    try {
        const accounts = await Account.findAll({
            where: {
                memberId: req.params.id,
                isActive: true,
            }
        });
        res.status(200).json(accounts);
    } catch (error) {
        logger.error(`Cannot retreive data with error ${error}`)
        res.status(500).json({ error: error.message });
    }
}
const getAllAccountsByAccountNumber = async (accountNumber) => {
    try {
        const account = await Account.findOne({
            where: {
                accountNumber,
            }
        });
        return account
    } catch (error) {
        logger.error(`Cannot retreive data with error ${error}`)
        return null
    }
}
const getAllAccountsByMemberIdService = async (memberId) => {
    try {
        const accounts = await Account.findAll({
            where: {
                memberId
            }
        });
        logger.warn(`account belong to member ${memberId} ${JSON.stringify(accounts)}`)
        return accounts;
    } catch (error) {
        logger.error(`Cannot retreive data with error ${error}`)
        return null
    }
}

const createAccount = async (account) => {
    try {
        const dbaccount = await Account.create(account);
        logger.info(`Create account completed`)
        return dbaccount
    } catch (error) {
        logger.error(`Cannot create account with error ${error}`)
        return null
    }
}

module.exports = {
    getAllAccountsByMemberId,
    getAllAccountsByMemberIdService,
    getAllAccountsByAccountNumber,
    createAccount,
}