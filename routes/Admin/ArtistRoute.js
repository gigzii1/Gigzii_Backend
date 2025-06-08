
const express = require("express");
const { verifyArtist, getArtists, getSingleArtist, toggleStatus } = require("../../controllers/Admin/ArtistController");
const { verifyToken } = require("../../utils/Auith");

const router = express.Router();

router.put("/verifyArtist/:id", verifyArtist);
router.get("/getArtists",verifyToken, getArtists)
router.get("/getSingleArtist/:id",verifyToken,getSingleArtist)
router.put("/toggleStatus/:id",verifyToken,toggleStatus)

module.exports = router;
