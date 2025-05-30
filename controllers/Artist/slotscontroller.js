const Slots = require("../../models/Slots"); // Adjust the path to your model

const toggleSlot = async (req, res) => {
  try {
    const artistId = req.user.userId;
    const { Date } = req.body;

    if (!Date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const existingSlot = await Slots.findOne({ artistId, Date });

    if (existingSlot) {
      if(existingSlot.isBooked){
      return res.status(400).json({ message: "You cannot remove  booked slot" });

      }
      await Slots.findByIdAndDelete(existingSlot._id);
      return res.status(200).json({ message: "Slot removed" });
    } else {
      const newSlot = new Slots({ artistId, Date });
      const savedSlot = await newSlot.save();
      const populatedSlot = await Slots.findById(savedSlot._id).populate("artistId");

      return res.status(201).json({ message: "Slot created", slot: populatedSlot });
    }
  } catch (error) {
    console.error("Error toggling slot:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {toggleSlot};