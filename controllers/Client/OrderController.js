const Razorpay = require('razorpay');
const OrderModel = require('../../models/OrderModel');
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.Razorpay_key_id,
  key_secret: process.env.Razorpay_key_secret,
});

const initiate=async(req,res)=>{
    const userId=req.user.userId
    const { artistId, slotId, address, amount } = req.body;
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
  });

  res.json({ razorpayOrderId: order.id });



}

const verifyPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  console.log("Razorpay values received:", razorpay_payment_id, razorpay_order_id, razorpay_signature);

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

const getOrderDetails=async(req,res)=>{
    console.log("yash")
    const{id}=req.params;
    const order=await OrderModel.findOne({razorpayOrderId:id});
    res.json({ success: true,order });

}

const getUserOrders = async (req, res) => {
  try {
    const  userId  = req.user.userId;

    const orders = await OrderModel.find({
      userId: userId,
      paymentStatus: "paid"
    })
    .sort({ createdAt: -1 }).populate('artistId').populate('slotId');

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      count: orders.length,
      data: orders
    });

  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not fetch orders."
    });
  }
};

 


module.exports={initiate,verifyPayment,getOrderDetails,getUserOrders}