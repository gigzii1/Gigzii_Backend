
const express = require("express");
const { getMyorders, updateOrderStatus } = require("../../controllers/Artist/ArtistOrderController");
const { verifyToken } = require("../../utils/Auith");

const router = express.Router();

router.get("/getMyOrders",verifyToken, getMyorders);
router.put("/updateOrderStatus/:id",verifyToken, updateOrderStatus);

module.exports = router;
