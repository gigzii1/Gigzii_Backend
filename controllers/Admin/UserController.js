const userModel = require("../../models/User");
const applyPagination = require("../../utils/dataUtils");
const getUsers = async (req, res) => {
  try {
    const { city, search, page = 1 } = req.query;

    const filter = { role: "user" };
    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { email: regex }, { city: regex }];
    }

    const allUsers = await userModel.find(filter).sort({ createdAt: -1 });

    const paginated = applyPagination(allUsers, parseInt(page), 8);

    return res.status(200).json({ status: true, ...paginated });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};


module.exports={getUsers}
