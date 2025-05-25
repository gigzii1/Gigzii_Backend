
const express = require("express");
const { verifyArtist } = require("../../controllers/Admin/UserController");

const router = express.Router();

router.put("/verifyArtist/:id", verifyArtist);

module.exports = router;
