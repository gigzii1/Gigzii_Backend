const OrderModel = require("../../models/OrderModel")
const userModel=require("../../models/User")
const getSummary = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const totalOrder = await OrderModel.find({ paymentStatus: "paid" });
    const todayBookings = await OrderModel.find({
      paymentStatus: "paid",
      createdAt: { $gte: startOfToday }
    });
    const monthlyBookings = await OrderModel.find({
      paymentStatus: "paid",
      createdAt: { $gte: startOfMonth }
    });

    const totalRevenue = totalOrder.reduce((sum, order) => sum + order.amount, 0);

    const registeredUsers = await userModel.countDocuments({role:"user"});
    const verifiedArtists = await userModel.countDocuments({ isVerified: true,role:"artist" });

    return res.json({
      status: true,
      todayBookings: todayBookings.length,
      monthlyBookings: monthlyBookings.length,
      totalRevenue,
      registeredUsers,
      verifiedArtists
    });
  } catch (err) {
    console.error("Error getting summary:", err);
    return res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};




module.exports={getSummary}