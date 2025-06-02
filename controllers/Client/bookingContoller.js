const Slots = require("../../models/Slots");
const Usermodel = require("../../models/User");
const mongoose = require("mongoose");

const getArtists = async (req, res) => {
  try {
    const { city, category } = req.query;
    if (!city || !category) {
      return res
        .status(400)
        .json({ message: "City and category are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    const artists = await Usermodel.find({
      city: city,
      eventcategories: category,
      isVerified: true,
    }).populate("eventcategories");

    return res.status(200).json(artists);
  } catch (error) {
    console.error("Error fetching artists:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;

    const artist = await Usermodel.findById(id).populate("eventcategories");

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    return res.status(200).json(artist);
  } catch (error) {
    console.error("Error fetching artist by ID:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getArtistSlots = async (req, res) => {
  try {
    const { id } = req.params;

    const slots = await Slots.find({ artistId: id })
      .populate("artistId")
      .sort({ Date: 1 });

    return res.status(200).json(slots);
  } catch (error) {
    console.error("Error fetching artist slots:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const getSlotById = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await Slots.findById(id);
    return res.status(200).json(slot);
  } catch (error) {}
};

module.exports = { getArtists, getArtistById, getArtistSlots, getSlotById };
