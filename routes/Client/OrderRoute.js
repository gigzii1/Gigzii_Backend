const express =require("express");
const { initiate, getOrderDetails, verifyPayment } = require("../../controllers/Client/OrderController");
const { verifyToken } = require("../../utils/Auith");

const router=express.Router();

router.post("/initiate",verifyToken, initiate)
router.post("/verifyPayment", verifyPayment)
router.get("/getOrderDetails/:id", getOrderDetails)

module.exports=router;