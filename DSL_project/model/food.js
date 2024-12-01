const mongoose = require('mongoose');


const foodSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  description: String,
  taste: String,
  user: String,
  nation_id: { type: mongoose.Schema.Types.ObjectId, ref: "nation_food",required: true },
  catagory_id: { type: mongoose.Schema.Types.ObjectId, ref: "catagory" , required: true }
});


const Food = mongoose.model('foods', foodSchema);

module.exports = Food;

