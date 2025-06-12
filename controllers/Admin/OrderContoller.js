const OrderModel = require("../../models/OrderModel");
const applyPagination = require("../../utils/dataUtils");
const getOrders = async (req, res) => {
  try {
    const { search, page = 1, status, date } = req.query;

    const filter = { paymentStatus: "paid" };

    if (search && /^[0-9a-fA-F]{24}$/.test(search)) {
      filter._id = search;
    }

    if (status) {
      filter.status = status;
    }

    let allOrders = await OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId")
      .populate("artistId")
      .populate("slotId");

    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0); // normalize to midnight

      allOrders = allOrders.filter((order) => {
        const rawSlotDate = order?.slotId?.Date;
        if (!rawSlotDate) return false;

        const slotDate = new Date(rawSlotDate);
        slotDate.setHours(0, 0, 0, 0); // normalize to midnight

        return slotDate.getTime() === selectedDate.getTime();
      });
    }

    const paginated = applyPagination(allOrders, parseInt(page), 8);
    return res.status(200).json({ success: true, ...paginated });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getOrders };
