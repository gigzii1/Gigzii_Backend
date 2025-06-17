const WalletModel = require("../../models/WalletModel");
const UserModel = require("../../models/User");
const applyPagination = require("../../utils/dataUtils");

const getWallets = async (req, res) => {
  try {
    const { type = "pending", page = 1, search = "" } = req.query;

    const matchingArtists = await UserModel.find({
      role: "artist",
      name: { $regex: search, $options: "i" },
    }).select("_id");

    const artistIds = matchingArtists.map((artist) => artist._id);

    let walletQuery = {
      artistId: { $in: artistIds },
    };

    if (type === "wallets") {
      walletQuery.balance = 0; // Pending payouts
    } else {
      walletQuery.balance = { $gt: 0 }; // Completed payouts
    }

    // 3. Fetch wallets with artist info
    const wallets = await WalletModel.find(walletQuery)
      .populate("artistId")
      .sort({ updatedAt: -1 });

    // 4. Paginate the result
    const paginated = applyPagination(wallets, parseInt(page), 10);

    // 5. Send response
    return res.status(200).json({
      status: true,
      data: paginated,
      total: wallets.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching wallets" });
  }
};

module.exports = { getWallets };
