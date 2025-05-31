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

const verifyPayment=async(req,res)=>{
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  console.log("ddd",razorpay_payment_id, razorpay_order_id, razorpay_signature)
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

}

const getOrderDetails=async(req,res)=>{
    console.log("yash")
    const{id}=req.params;
    const order=await OrderModel.findOne({razorpayOrderId:id});
    res.json({ success: true,order });

}
module.exports={initiate,verifyPayment,getOrderDetails}