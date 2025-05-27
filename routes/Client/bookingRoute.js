const express = require("express");
const { getArtists, getArtistById, getArtistSlots, getSlotById } = require("../../controllers/Client/bookingContoller");

const router = express.Router();


router.get("/getArtists",getArtists)
router.get("/getArtistsByid/:id",getArtistById)
router.get("/getArtistSlots/:id",getArtistSlots)
router.get("/getSlotById/:id",getSlotById)
module.exports = router;
