

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
router.post("/create", controller.createMember)
    .put("/update/:id", controller.updateMember)
    .put("/resetpass/:tel", controller.resetPassword)
    .delete("/find/:id", controller.deleteMember)
    .get("/find", controller.getAllMembers)
    .get("/findAll", controller.getAllMembers)
    .get("/find/:id", controller.getMemberById)
    // .post("/bulkCreate",service.createHulkStockCard)
module.exports = router