const Usermodel = require("../../models/User");
const applyPagination = require("../../utils/dataUtils");
const sendmail = require("../../utils/mail");

const verifyArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Usermodel.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );

    if (!artist) {
      return res
        .status(404)
        .json({ status: false, message: "Artist not found" });
    }
    await sendmail(
      artist?.email,
      `Welcome onboarding ${artist.name} Your profile is verified , login to gigzi `
    );

    res.status(200).json({
      status: true,
      message: "Artist verified successfully",
      artist,
    });
  } catch (error) {
    console.error("Error verifying artist:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

const getArtists = async (req, res) => {
  try {
    const { isVerified, city, category, search, page = 1 } = req.query;

    const filter = { role: "artist" };

    if (isVerified === "true" || isVerified === "false") {
      filter.isVerified = isVerified === "true";
    }

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    if (category) {
      filter.eventcategories = category;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { email: regex }, { city: regex }];
    }

    const allArtists = await Usermodel.find(filter)
      .sort({ createdAt: -1 })
      .populate("eventcategories", "name");

    const paginated = applyPagination(allArtists, parseInt(page), 8);

    res.status(200).json({
      status: true,
      message: "Artists fetched successfully",
      ...paginated,
    });
  } catch (error) {
    console.error("Error fetching artists:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch artists",
    });
  }
};

const getSingleArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const Artist = await Usermodel.findById(id).populate(
      "eventcategories",
      "name"
    );
    res.status(200).json({
      status: true,
      message: "Artists fetched successfully",
      Artist,
    });
  } catch (error) {}
};

const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Usermodel.findById(id);
    artist.isVerified = !artist.isVerified;
    await artist.save();
    return res.status(200).json({
      status: true,
      message: `Artist has been ${
        artist.isVerified ? "verified" : "unverified"
      }`,
      data: artist,
    });
  } catch (error) {}
};
module.exports = { verifyArtist, getArtists, getSingleArtist,toggleStatus };
