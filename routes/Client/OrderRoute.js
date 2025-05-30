const express =require("express");
const { initiate, verifyOrder, getOrderDetails } = require("../../controllers/Client/OrderController");
const { verifyToken } = require("../../utils/Auith");

const router=express.Router();

router.post("/initiate",verifyToken, initiate)
router.post("/verifyOrder", verifyOrder)
router.get("/getOrderDetails/:id", getOrderDetails)

module.exports=router;