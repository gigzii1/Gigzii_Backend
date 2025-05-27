const Slots = require("../../models/Slots");

const addSlots = async (req, res) => {
  try {
    const artistId = req.user.userId;
    const { Date, priceSlot } = req.body;

    if (!Date || !priceSlot) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const slot = new Slots({
      artistId,
      Date,
      priceSlot,
    });

    const savedSlot = await slot.save();
    const populatedSlot = await Slots.findById(savedSlot._id).populate("artistId");
    res.status(201).json({ message: "Slot created successfully", slot: populatedSlot });
  } catch (error) {
    console.error("Error adding slot:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports={addSlots}