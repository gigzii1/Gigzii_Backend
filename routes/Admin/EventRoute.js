const express = require("express");
const { createEventCategory, getCategories } = require("../../controllers/Admin/EventController");

const router = express.Router();

router.post("/createEventCategory", createEventCategory);
router.get("/getEventCategories", getCategories);

module.exports = router;
