
const express = require("express");
const { addSlots } = require("../../controllers/Artist/slotscontroller");
const { verifyToken } = require("../../utils/Auith");

const router = express.Router();

router.post("/addSlots",verifyToken, addSlots);

module.exports = router;
