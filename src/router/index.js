
const userRouter = require('../operator').router
const accountRouter = require('../account').router
const bankRouter = require('../bank').router
const currencyRouter = require('../currency').router
const memberRouter = require('../member').router
const operateRouter = require('../operator').router
const ftRouter = require('../funds_transfer').router

const outletRouter = require('../outlet').router
const menuHeaderRouter = require('../menu').router
const menuLineRouter = require('../menu/line').router
const groupRouter = require('../group').router
const authorityRouter = require('../authority').router
const terminalRouter = require('../terminal').router
module.exports={
    userRouter,
    accountRouter,
    bankRouter,
    currencyRouter,
    memberRouter,
    operateRouter,
    ftRouter,
    outletRouter,
    menuHeaderRouter,
    menuLineRouter,
    groupRouter,
    authorityRouter,
    terminalRouter
}