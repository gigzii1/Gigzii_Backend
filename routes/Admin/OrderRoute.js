const express = require("express");
const { getOrders } = require("../../controllers/Admin/OrderContoller");
const { verifyToken } = require("../../utils/Auith");
const router = express.Router();

router.get("/getOrders", verifyToken, getOrders);

module.exports = router;
