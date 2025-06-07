
const express = require("express");
const { verifyArtist, getArtists } = require("../../controllers/Admin/ArtistController");

const router = express.Router();

router.put("/verifyArtist/:id", verifyArtist);
router.get("/getArtists",getArtists)

module.exports = router;
