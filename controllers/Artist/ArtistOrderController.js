const OrderModel = require("../../models/OrderModel");

const getMyorders = async (req, res) => {
  try {
    const id = req.user.userId;
    const orders = await OrderModel.find({ artistId: id })
      .sort({ createdAt: -1 })
      .populate("artistId")
      .populate("slotId");
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      count: orders.length,
      data: orders,
    });
  } catch (error) {}
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (user.role == "user") {
      res.status(500).json({ message: "user can't update order status" });
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMyorders, updateOrderStatus };
