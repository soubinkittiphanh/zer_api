require('dotenv').config()
const express = require("express");
const cors = require("cors");
const myRouter = require("./router")
const authService = require('./auth/')
const jwtUtil =require('./api/jwtApi');
const buildApp = async () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.get("/hello", (req, res) => {
        res.send("Succeed server is ready")
    })
    app.use("/api/user",myRouter.userRouter)
    app.use("/api/account",myRouter.accountRouter)
    app.use("/api/bank",myRouter.bankRouter)
    app.use("/api/currency",myRouter.currencyRouter)
    app.use("/api/member",myRouter.memberRouter)
    app.use("/api/ft",myRouter.ftRouter)

    app.use("/api/outlet",myRouter.outletRouter)
    app.use("/api/terminal",myRouter.terminalRouter)
    app.use("/api/menuHeader",myRouter.menuHeaderRouter)
    app.use("/api/menuLine",myRouter.menuLineRouter)
    app.use("/api/authority",myRouter.authorityRouter)
    app.use("/api/group",myRouter.groupRouter)

    app.post("/api/authen/backend",authService.authenticate)
    app.post("/userLogin",authService.authenticate)
    app.post("/api/auth/member",authService.authenticateMember)
    app.get("/me",jwtUtil.getUserFromToken)
    app.post("/api/auth/reresh",authService.refreshToken)
    app.post("/api/auth/reset",authService.resetPassword)
    app.post("/api/auth/reset/member",authService.resetPasswordMember)
    
    return app;
}

module.exports = buildApp;