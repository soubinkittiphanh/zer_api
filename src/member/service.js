const bcryptService = require('../api/bcryptService');
const { getLastNChars } = require('../api/common');
const logger = require('../api/logger');
const { Member } = require('../models'); // Adjust this import according to your project structure

const getUserByTel = async (tel) => {
    try {
        const members = await Member.findOne({
            where: {
                tel
            }
        });
        logger.info(`user found ${JSON.stringify(members)}`)
        return members
    } catch (error) {
        logger.error(`Cannot find user with error ${error}`)
        return null
    }
}
const getUserByPk = async (id) => {
    try {
        const account = await Member.findByPk(id);
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
        const account = await Member.findByPk(id);
        if (!account) {
            logger.error(`account not found`)
            response.statusCode = 403
        } else {
            const updatedAccount = await account.update({ password: newpass });
            response.data = updatedAccount
            logger.info(`Password has been reset`)

        }
    } catch (error) {
        logger.error(`Cannot reset password ${error}`)
        response.statusCode = 503
    }
    return response
}


const createMember = async (name, tel, password) => {
    try {
        // ********* Check exist user ***********
        const phone8chars = getLastNChars(tel, 8)
        const dbMember = await getUserByTel(phone8chars)
        if (dbMember) {
            logger.error(`User already existed `)
            throw new Error(`User already existed ${dbMember.name}`)
            return null
        }
        const hashedPassword = await bcryptService.hashPassword(password);
        const member = await Member.create({
            name: name,
            tel: phone8chars,
            password: hashedPassword
        });
        return member
    } catch (error) {
        logger.error(`Cannot register user with error ${error}`)
        return null
    }
}
module.exports = {
    getUserByTel,
    getUserByPk,
    resetPassword,
    createMember
}