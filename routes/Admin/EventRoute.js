const express = require("express");
const { createEventCategory, getCategories, getSingleCategory, editCategory } = require("../../controllers/Admin/EventController");

const router = express.Router();

router.post("/createEventCategory", createEventCategory);
router.get("/getEventCategories", getCategories);
router.get("/getSingleCategory/:id", getSingleCategory);
router.put("/editCategory/:id", editCategory);

module.exports = router;
