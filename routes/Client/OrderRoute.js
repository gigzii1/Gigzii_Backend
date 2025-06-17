const express = require("express");
const {
  initiate,
  getOrderDetails,
  verifyPayment,
  getUserOrders,
  markOrderComplete,
} = require("../../controllers/Client/OrderController");
const { verifyToken } = require("../../utils/Auith");

const router = express.Router();

router.post("/initiate", verifyToken, initiate);
router.post("/verifyPayment", verifyPayment);
router.get("/getUserOrders", verifyToken, getUserOrders);
router.get("/getOrderDetails/:id", getOrderDetails);
router.post("/markOrderComplete",markOrderComplete);

module.exports = router;
