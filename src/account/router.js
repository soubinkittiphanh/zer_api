

const {validateToken} = require("../api/jwtApi")
const controller = require("./controller")
const service = require("./service")
const express = require("express")
const router = express.Router()

const validator = require("./validator")
router.use(validateToken)
// No auth 
// router.use((req,res,next)=>{
//     next()
// })
router.post("/create", controller.createAccount)
    .put("/update/:id", controller.updateAccount)
    .delete("/find/:id", controller.deleteAccount)
    .get("/find", controller.getAllAccounts)
    .get("/findAll", controller.getAllAccounts)
    .get("/find/:id", controller.getAccountById)
    .get("/find/member/:id", service.getAllAccountsByMemberId)
    // .post("/bulkCreate",service.createHulkStockCard)
module.exports = router