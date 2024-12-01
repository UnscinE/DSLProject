var express = require("express");
const Food = require("../model/food");
const User = require("../model/user");
const nation = require("../model/nation_food");
const Category = require("../model/catagory");

var router = express.Router();

/* GET food filter */
router.get("/filter", async function (req, res, next) {
  let { category, food_type} = req.query;
  const admin_id = await User.find({role: "admin"});
  
  const query = { user: admin_id[0]._id.toString()};
  if (category && category !== "ทั้งหมด") {
    query.nation_id = category;
  }
  if (food_type && food_type !== "ทั้งหมด") {
    query.catagory_id = food_type;
  }
  

  try {
    // ดึงข้อมูลอาหารที่ตรงกับการค้นหาและ populate ข้อมูลที่เกี่ยวข้อง
    const foods = await Food.find(query)
      .populate("catagory_id") // Populate catagory_id
      .populate("nation_id"); // Populate nation_id

    // ส่งข้อมูลอาหารในรูปแบบ JSON
    res.json(foods);
    
  } catch (err) {
    next(err);
  }
});

router.get("/filter1", async function (req, res, next) {
  let { category, food_type } = req.query;

  console.log(category)

  const query = {};

  if (req.session.userId) {

    query.user = req.session.userId;

  } else {

    query.user = null;

  }

  if (category && category !== "ทั้งหมด") {
    query.nation_id = category;
  }
  if (food_type && food_type !== "ทั้งหมด") {
    query.catagory_id = food_type;
  }

    const foods = await Food.find(query)
      .populate("catagory_id") 
      .populate("nation_id"); 

    console.log(foods);

    res.json(foods);

});

module.exports = router;