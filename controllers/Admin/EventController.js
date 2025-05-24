const EventCategoryModel = require("../../models/EventCategoryModel");

const createEventCategory=async(req,res)=>{
   const{name,image}=req.body;
   const data=new EventCategoryModel({name,image});
   await data.save();
    res.status(201).json({status:true, message: 'category created successfully' });

}

const getCategories=async(req,res)=>{
    const categories=await EventCategoryModel.find({})
    res.status(201).json({status:true, categories });

}

module.exports={createEventCategory,getCategories}