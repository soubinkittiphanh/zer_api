const logger = require('../api/logger');
const User = require('../models').user;
const { terminal, group } = require('../models');
const getUserById = async (cus_id) => {

    try {
        const user = await User.findOne({
            where: {
                cus_id
            }, include: [
                {
                    model: terminal,
                    through: { attributes: [] }
                },
                {
                    model: group,
                    as: 'userGroup',
                    attributes: ['code', 'name', 'id'],
                }]
        })
        logger.info(`**********${user}**********`)
        return user;
    } catch (error) {
        logger.error(`Cannot get user with error ${error}`)
        return null
    }
};
const getUserByPk = async (id) => {
    try {
        const account = await User.findByPk(id);
        return account
    } catch (error) {
        logger.error(`Cannot reset password ${error}`)
        return null
    }
};

const resetPassword = async (id, newpass) => {
    let response = {
        statusCode: 200,
        data: null
    }
    try {
        const account = await User.findByPk(id);
        if (!account) {
            logger.error(`account not found`)
            response.statusCode = 403
        } else {
            const updatedAccount = await account.update({ cus_pass: newpass });
            response.data = updatedAccount
            logger.info(`Password has been reset`)

        }
    } catch (error) {
        logger.error(`Cannot reset password ${error}`)
        response.statusCode = 503
    }
    return response
}

module.exports = {
    getUserById,
    resetPassword,
    getUserByPk
}