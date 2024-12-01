var express = require("express");
const Food = require("../model/food");
const Category = require("../model/catagory");
const Nation_food = require("../model/nation_food");
const User = require("../model/user");
var router = express.Router();

// GET home page
router.get("/", async function (req, res, next) {
  try {

    // ลบข้อมูลอาหารที่ไม่มีผู้ใช้ (user: null)
    const result = await Food.deleteMany({ user: null });

    // ดึง admin ID
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return res.status(500).send("Admin user not found");
    }

    // ตั้งค่า query สำหรับดึงข้อมูลอาหาร
    let foods = [];
  
    // แสดงเฉพาะอาหารของ admin
    foods = await Food.find({ user: admin._id }, { name: 1, nation_id: 1, catagory_id: 1 });

    // ดึงเฉพาะ nation และ category ที่เกี่ยวข้องกับอาหารที่แสดง
    const nationIds = [...new Set(foods.map(food => food.nation_id).filter(Boolean))];
    const categoryIds = [...new Set(foods.map(food => food.catagory_id).filter(Boolean))];

    // ดึง nations และ categories จากฐานข้อมูล
    const nations = await Nation_food.find({ _id: { $in: nationIds } });
    const categories = await Category.find({ _id: { $in: categoryIds } });

    // ตรวจสอบข้อมูลที่ได้
    console.log(foods);
    console.log(nations[0]);
    console.log(categories[0]);

    // ส่งข้อมูลไปยังหน้าเว็บ
    res.render("page_1", { title: "Home", foods, nations, categories });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
