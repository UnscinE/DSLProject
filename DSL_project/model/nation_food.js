const mongoose = require("mongoose");


const nationFoodSchema = new mongoose.Schema({
  nation: { type: String, required: true }
});


const Nation_food = mongoose.model("nation_food", nationFoodSchema);

module.exports = Nation_food;

