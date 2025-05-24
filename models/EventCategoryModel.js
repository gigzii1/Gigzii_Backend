const mongoose = require('mongoose');

const eventcat = new mongoose.Schema({
   name:{type:String},image:{type:String}, 
 
});

module.exports = mongoose.model('Eventcategory', eventcat);