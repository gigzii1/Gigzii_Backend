const EventCategoryModel = require("../../models/EventCategoryModel");
const applyPagination = require("../../utils/dataUtils");

const createEventCategory = async (req, res) => {
  const { name, image, fees, commisonPercentage } = req.body;
  const data = new EventCategoryModel({
    name,
    image,
    fees,
    commisonPercentage,
  });
  await data.save();
  res
    .status(201)
    .json({ status: true, message: "category created successfully" });
};

const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await EventCategoryModel.findById(id);
    res.status(201).json({
      status: true,
      message: "category fetched successfully",
      category,
    });
  } catch (error) {}
};

const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, fees, commisonPercentage } = req.body;

    const updatedCategory = await EventCategoryModel.findByIdAndUpdate(
      id,
      { name, image, fees, commisonPercentage },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const { search, page = 1 } = req.query;

    const filter = {};
    if (search) {
      const regex = new RegExp(search, "i");
      filter.name = regex;
    }

    const allCategories = await EventCategoryModel.find(filter).sort({
      createdAt: -1,
    });

    const paginated = applyPagination(allCategories, parseInt(page), 8);

    return res.status(200).json({ status: true, ...paginated });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

module.exports = { createEventCategory, getCategories, getSingleCategory,editCategory };
