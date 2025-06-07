const express = require("express");
const { getSummary } = require("../../controllers/Admin/DashBoardContoller");
const { verifyToken } = require("../../utils/Auith");

const router = express.Router();

router.get("/getSummary",verifyToken, getSummary);

module.exports = router;
