
const express = require("express");
const { addSlots, toggleSlot } = require("../../controllers/Artist/slotscontroller");
const { verifyToken } = require("../../utils/Auith");

const router = express.Router();

router.post("/toggleSlot",verifyToken, toggleSlot);

module.exports = router;
