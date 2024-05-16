

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
router.post("/create", controller.createFundsTransfer)
    .put("/update/:id", controller.updateFundsTransfer)
    .delete("/find/:id", controller.deleteFundsTransfer)
    .get("/find", controller.getAllFundsTransfersInactiveByDate)
    .get("/find/inactive", controller.getAllFundsTransfersInactive)
    // .get("/find/account", controller.getAllFundsTransferAccountIdByDate)
    .get("/findAll", controller.getAllFundsTransferAccountIdByDate)
    .get("/find/:id", controller.getFundsTransferById)
    .get("/find/account/:memberId", controller.getAllFundsTransfersByMemberId)
    // .post("/bulkCreate",service.createHulkStockCard)
module.exports = router