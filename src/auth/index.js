const { jwtApi } = require('../api');
const logger = require('../api/logger');
const memberService = require('../member/service')
const userService = require('../operator/service')
const bcryptService = require('../api/bcryptService')
const secretKey = require('../config');
const jwt = require('jsonwebtoken');
const authenticate = async (req, res) => {
    const body = req.body;
    logger.info("************* User auth  *****************");
    const { mem_id, mem_pwd } = body;
    const user = await userService.getUserById(mem_id)
    if (!user) return res.send({ "accessToken": "", "error": "ລະຫັດຜ່ານ ຫລື ໄອດີບໍ່ຖືກຕ້ອງ" })
    logger.info(`**********${user.cus_name}**********`)
    // ************ Compare the password ************
    const passwordMatch = await bcryptService.comparePassword(mem_pwd, user.cus_pass)
    const plainPayload = {
        id: user.id,
        cus_id: user.cus_id,
        cus_name: user.cus_name,
        cus_tel: user.cus_tel,
        userGroup: user.userGroup,
        terminal: user.terminals
    };
    if (passwordMatch) {
        logger.info(`Authenticate succeed`)
        const token = jwtApi.generateToken(plainPayload)
        logger.info(`Token generated succeed `)
        return res.send(token)
    } else {
        logger.error(`Authenticate fail`)
        res.status(401).send('Authentication failed');
    }
}
const authenticateMember = async (req, res) => {
    const body = req.body;
    logger.info("************* User auth  *****************");
    const { tel, password } = body;
    const user = await memberService.getUserByTel(tel)
    if (!user) return res.send({ "accessToken": "", "error": "ລະຫັດຜ່ານ ຫລື ໄອດີບໍ່ຖືກຕ້ອງ" })
    logger.info(`**********${user.cus_name}**********`)
    // ************ Compare the password ************
    const passwordMatch = await bcryptService.comparePassword(password, user.password)
    const plainPayload = {
        id: user.id,
        name: user.name,
        tel: user.tel,
    };
    if (passwordMatch) {
        logger.info(`Authenticate succeed`)
        const token = jwtApi.generateToken(plainPayload)
        logger.info(`Token generated succeed `)
        return res.send(token)
    } else {
        logger.error(`Authenticate fail`)
        res.status(401).send('Authentication failed');
    }
}
const resetPassword = async (req, res) => {
    const body = req.body;
    logger.info("************* User auth  *****************");
    const { mem_id, mem_pwd,mem_newpass,mem_confpass, } = body;
    const user = await userService.getUserByPk(mem_id)
    if (!user) return res.send({ "accessToken": "", "error": "ລະຫັດຜ່ານ ຫລື ໄອດີບໍ່ຖືກຕ້ອງ" })
        logger.info(`**********${user.cus_name}**********`)
    // ************ Compare the password ************
    const passwordMatch = await bcryptService.comparePassword(mem_pwd, user.cus_pass)
    if (passwordMatch) {
        logger.info(`Password matched`)
        const hashedPassword = await bcryptService.hashPassword(mem_newpass);
        const response = await userService.resetPassword(mem_id,hashedPassword)
        return res.status(response.statusCode).send(response.data)
    } else {
        logger.error(`Incorrect password`)
        res.status(401).send('Authentication failed');
    }
}
const resetPasswordMember = async (req, res) => {
    const body = req.body;
    logger.info("************* User auth  *****************");
    const { mem_id, mem_pwd,mem_newpass,mem_confpass, } = body;
    const user = await memberService.getUserByPk(mem_id)
    if (!user) return res.send({ "accessToken": "", "error": "ລະຫັດຜ່ານ ຫລື ໄອດີບໍ່ຖືກຕ້ອງ" })
        logger.info(`**********${user.cus_name}**********`)
    // ************ Compare the password ************
    const passwordMatch = await bcryptService.comparePassword(mem_pwd, user.password)
    if (passwordMatch) {
        logger.info(`Password matched`)
        const hashedPassword = await bcryptService.hashPassword(mem_newpass);
        const response = await memberService.resetPassword(mem_id,hashedPassword)
        return res.status(response.statusCode).send(response.data)
    } else {
        logger.error(`Incorrect password`)
        res.status(401).send('Authentication failed');
    }
}

const refreshToken = (req, res) => {
    logger.warn(`Refresh token process`)
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        logger.error(`REFRESH TOKEN NOT FOUND `)
        return res.sendStatus(401);
    }

    jwt.verify(refreshToken, secretKey.rfTkSecret, (err, user) => {
        if (err) {
            logger.error(`validate token fail ${err}`)
            return res.sendStatus(403);
        }
        logger.info(`USER DECODE ${JSON.stringify(user)}`)
        const accessToken = jwtApi.generateToken({
            id: user.id,
            cus_id: user.cus_id,
            cus_name: user.cus_name,
            cus_tel: user.cus_tel,
        });
        res.send(accessToken);
    });
}

module.exports = {
    authenticate,
    refreshToken,
    resetPassword,
    authenticateMember,
    resetPasswordMember
}