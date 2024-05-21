require('dotenv').config()
const express = require("express");
const cors = require("cors");
const myRouter = require("./router")
const authService = require('./auth/')
const jwtUtil = require('./api/jwtApi');
const memberService = require(`./member/service`);
const accountService = require(`./account/service`);

const logger = require('./api/logger');
const buildApp = async () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.get("/hello", (req, res) => {
        res.send("Succeed server is ready")
    })
    app.use("/api/user", myRouter.userRouter)
    app.use("/api/account", myRouter.accountRouter)
    app.use("/api/bank", myRouter.bankRouter)
    app.use("/api/currency", myRouter.currencyRouter)
    app.use("/api/member", myRouter.memberRouter)
    app.use("/api/ft", myRouter.ftRouter)

    app.use("/api/outlet", myRouter.outletRouter)
    app.use("/api/terminal", myRouter.terminalRouter)
    app.use("/api/menuHeader", myRouter.menuHeaderRouter)
    app.use("/api/menuLine", myRouter.menuLineRouter)
    app.use("/api/authority", myRouter.authorityRouter)
    app.use("/api/group", myRouter.groupRouter)

    app.post("/api/authen/backend", authService.authenticate)
    app.post("/userLogin", authService.authenticate)
    app.post("/api/auth/member", authService.authenticateMember)
    app.get("/api/logout", jwtUtil.deleteToken)
    app.get("/me", jwtUtil.getUserFromToken)
    app.post("/api/auth/reresh", authService.refreshToken)
    app.post("/api/auth/reset", authService.resetPassword)
    app.post("/api/auth/reset/member", authService.resetPasswordMember)
    app.post("/api/register/member", async (req, res) => {
        const { name, tel, password } = req.body.member
        const member = await memberService.createMember(name, tel, password)
        if (member) {
            logger.info(`Register user completed ${member.name} `)
            req.body.account.memberId = member.id
            logger.warn(`Account data ${JSON.stringify(req.body.account)}`)
            const account = await accountService.createAccount(req.body.account)
            return res.status(201).send(member)
        }
        logger.error(`Unable to register user. try again later`)
        res.status(503).send(member)
    })

    return app;
}

module.exports = buildApp;