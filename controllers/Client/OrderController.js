const Razorpay = require("razorpay");
const OrderModel = require("../../models/OrderModel");
const crypto = require("crypto");
const EventModel = require("../../models/EventCategoryModel");
const WalletModel = require("../../models/WalletModel");

const razorpay = new Razorpay({
  key_id: process.env.Razorpay_key_id,
  key_secret: process.env.Razorpay_key_secret,
});

const initiate = async (req, res) => {
  const userId = req.user.userId;
  const { artistId, slotId, address, amount, eventCategory } = req.body;
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    payment_capture: 1,
  });
  await OrderModel.create({
    userId,
    artistId,
    slotId,
    address,
    amount,
    razorpayOrderId: order.id,
    status: "pending",
    eventCategory,
  });

  res.json({ razorpayOrderId: order.id });
};

const verifyPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  console.log(
    "Razorpay values received:",
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
  );

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing Razorpay parameters" });
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.Razorpay_key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    await OrderModel.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        paymentStatus: "paid",
        status: "confirmed",
      }
    );
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Invalid signature" });
  }
};

const getOrderDetails = async (req, res) => {
  console.log("yash");
  const { id } = req.params;
  const order = await OrderModel.findOne({ razorpayOrderId: id });
  res.json({ success: true, order });
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await OrderModel.find({
      userId: userId,
      paymentStatus: "paid",
    })
      .sort({ createdAt: -1 })
      .populate("artistId")
      .populate("slotId")
      .populate("eventCategory");

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not fetch orders.",
    });
  }
};

const markOrderComplete = async (req, res) => {
  try {
    const { orderId, artistId } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.mark_completed_by_user = true;

    await order.save();
    const eventCategory = await EventModel.findById(order.eventCategory);
    if (!eventCategory)
      return res.status(404).json({ message: "Event category not found" });

    const amountToArtistWallet = order.amount - eventCategory.commission;
    const gigziCommission = order.amount - amountToArtistWallet;

    let wallet = await WalletModel.findOne({ artistId });

    const transaction = {
      type: "credit",
      amount: amountToArtistWallet,
      note: "Credited for completed event",
      date: new Date(),
      eventId: order._id,
      admin: "system",
      method: "system",
    };

    if (!wallet) {
      wallet = await WalletModel.create({
        artistId,
        balance: amountToArtistWallet,
        transactions: [transaction],
      });
    } else {
      wallet.balance += amountToArtistWallet;
      wallet.transactions.push(transaction);
      await wallet.save();
    }

    return res.status(200).json({
      message: "Order marked complete and wallet updated",
      credited: amountToArtistWallet,
      newWalletBalance: wallet.balance,
    });
  } catch (error) {
    console.error("Error in markOrderComplete:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  initiate,
  verifyPayment,
  getOrderDetails,
  getUserOrders,
  markOrderComplete,
};
