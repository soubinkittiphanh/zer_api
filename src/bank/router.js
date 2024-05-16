

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
router.post("/create", controller.createBank)
    .put("/update/:id", controller.updateBank)
    .delete("/find/:id", controller.deleteBank)
    .get("/find", controller.getAllBanks)
    .get("/findAll", controller.getAllBanks)
    .get("/find/:id", controller.getBankById)
    // .post("/bulkCreate",service.createHulkStockCard)
module.exports = router