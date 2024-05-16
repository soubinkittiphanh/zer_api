
const jwt = require('jsonwebtoken');
const logger = require('./logger');
const secretKey = require('../config').actksecret;
const secretKeyRefresh = require('../config').rfTkSecret;
function validateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).send('Request without token is prohibited')
    jwt.verify(token, secretKey, (error, user) => {
        logger.warn(`Validating token...`)
        if (error) {
            logger.error(`Something wrong in token ${error}`)
            return res.status(403).send('Token invalid or expired!')
        }
        logger.warn(`User name from token: ${user.cus_name}`);
        req.user = user;
        next()
    })
}

const generateToken = (user) => {
    // const user = { name: u_name,tel:u_phone,id:u_id };
    const accessToken = jwt.sign(user, secretKey, { expiresIn: '24h' });
    const refreshToken = generateRefreshToken(user)
    logger.warn("Token ===> send to client " + accessToken)
    return { accessToken, refreshToken, user }
}
const getUserFromToken = (req, res) => {
    const authHeader = req.headers['authorization']
    logger.info("Decrypted user request header: " + authHeader);
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return error.status(401).send('Invalid token')
    jwt.verify(token, secretKey, (error, user) => {
        if (error) {
            logger.error(`Cannot decrypt user from token ${error}`)
            return res.status(403).send('Token invalid or expired!')//res.sendStatus(403).send('invalid')
        }
        logger.warn(`user decrypted ${user.cus_name}`);
        res.status(200).send({ user })
    })
}

const deleteToken = (req, res) => {
    const dateTime = new Date(Date.now()).toLocaleString()
    logger.warn("Signout: ", dateTime);
    const authHeader = req.headers['authorization']
    logger.info("Middleware header: " + authHeader);
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send('Invalid token')
    const decodedToken = jwt.decode(token);
    decodedToken.exp = 0;
    res.status(200).send({ status: 'succeed' })
}

const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user.id,
        cus_id: user.cus_id,
        cus_name: user.cus_name,
        cus_tel: user.cus_tel,
    }, secretKeyRefresh, { expiresIn: '1d' });
}

module.exports = { validateToken, generateToken, getUserFromToken, deleteToken, generateRefreshToken }