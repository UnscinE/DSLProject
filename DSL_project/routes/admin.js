const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Nation_food = require("../model/nation_food");
const User = require("../model/user");
const Food = require("../model/food");
const Catagory = require("../model/catagory");
const nation = require("../model/nation_food");

router.get("/dashboard", async (req, res) => {
  const user = await User.find();

  function removeObjectWithId(user, id) {
    const objWithIdIndex = user.findIndex((obj) => obj.id === id);
    user.splice(objWithIdIndex, 1);
    return user;
  }

  removeObjectWithId(user, req.session.userId);

  const food = await Food.find().populate("nation_id").populate("catagory_id");

  const catagory = await Catagory.find();
  const nationFood = await nation.find();

  res.render("adminpage", {
    user: user,
    food: food,
    catagory: catagory,
    nationFood: nationFood,
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.post("/user/delete/:id", async (req, res) => {

  await User.findByIdAndDelete(req.params.id);
  res.redirect("/dashboard");

});

router.get("/api/metrics", async (req, res) => {
  try {
    // Fetch the database stats
    const dbStats = await mongoose.connection.db.command({ dbStats: 1 });

    const [totalUser, totalFood, totalCatagory, totalNationFood] =
      await Promise.all([
        User.countDocuments(),
        Food.countDocuments(),
        Catagory.countDocuments(),
        nation.countDocuments(),
      ]);

    // Create metrics object with relevant information
    const metrics = {
      totalConnections: mongoose.connection.readyState, 
      activeConnections: mongoose.connection.totalConnections || 0, 
      databaseSize: (dbStats.dataSize / 1024).toFixed(2), 
      collectionsCount: dbStats.collections, 
      documentsCount: dbStats.objects,

      totalUser,
      totalFood,
      totalCatagory,
      totalNationFood,
    };

    res.json(metrics);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ error: "Error fetching metrics" });
  }
});

  router.get('/food/add', async (req, res) => {
    const nations = await nation.find();
    const categories = await Catagory.find();
    res.render('form_food', { food: null, nations, categories });
  });

router.post('/food/add', async (req, res) => {
  const { name, calories, description, taste, nation_id, catagory_id } = req.body;
  
  const newFood = new Food({
      name,
      calories,
      description,
      taste,
      nation_id,
      catagory_id,
      user: req.session.userId
  });
  
  await newFood.save();
  res.redirect('/dashboard'); // Redirect to dashboard or food list
});

router.post("/createFood", async function (req, res, next) {
  const { foodName, category, food_type, calories, description, taste } =
    req.body;
  const newNation = new Nation_food({ nation: Food_input.Nation_food });
  newNation
    .save()
    .then((nation_food) => {
      console.log("Nation saved:", Food_input.Nation_food);

      // เพิ่ม Category ใหม่
      const newCatagory = new Catagory({
        name: Food_input.Catagory.name,
      });
      newCatagory
        .save()
        .then((catagory) => {
          console.log("Category saved:", newFood.Catagory.name);

          // เพิ่ม Food ใหม่ ที่อ้างอิงถึง Nation และ Category
          const newFood = new Food({
            name: Food_input.name,
            calories: Food_input.calories,
            description: Food_input.description,
            taste: Food_input.taste,
            nation_id: nation_food._id, // อ้างอิงถึง Nation
            catagory_id: catagory._id, // อ้างอิงถึง Category
          });

          newFood
            .save()
            .then((food) => {
              console.log("Food saved:", food);
              res.send(food);
            })
            .catch((err) => console.error("Error saving food:", err));
        })
        .catch((err) => console.error("Error saving category:", err));
    })
    .catch((err) => console.error("Error saving nation:", err));
});

// Edit food router
router.get("/food/edit/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate("nation_id")
      .populate("catagory_id");
    const nations = await nation.find();
    const categories = await Catagory.find();

    res.render("Form_food", { food, nations, categories });
  } catch (error) {
    console.error("Error fetching food item:", error);
    res.status(500).send("Error fetching food item");
  }
});

router.post("/food/update/:id", async (req, res) => {
  const { name, calories, description, taste, nation_id, catagory_id } =
    req.body;

    await Food.findByIdAndUpdate(req.params.id, {
    name,
    calories,
    description,
    taste,
    nation_id,
    catagory_id,
  });

  res.redirect("/dashboard");
});

router.post("/food/delete/:id", async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.redirect("/dashboard");
});

// Edit category router
router.get("/category/add", async (req, res) => {
  const category = null;
  res.render("Form_category", { category });
});

router.post("/category/create", async (req, res) => {
  const { name } = req.body;
  const newCategory = new Catagory({ name });
  await newCategory.save();
  res.redirect("/dashboard");
});

router.get("/category/edit/:id", async (req, res) => {
  const category = await Catagory.findById(req.params.id);
  res.render("Form_category", { category });
});

router.post("/category/update/:id", async (req, res) => {
  const { name } = req.body;

  await Catagory.findByIdAndUpdate(req.params.id, {
    name,
  });

  res.redirect("/dashboard");
});

router.post("/category/delete/:id", async (req, res) => {
  await Catagory.findByIdAndDelete(req.params.id);
  res.redirect("/dashboard");
});

// Edit national router
router.get("/national/add", async (req, res) => {
  const nation = null;
  res.render("Form_nation", { nation });
});

router.post("/nation/create", async (req, res) => {
  const { nation } = req.body;
  const newNation = new Nation_food({ nation });
  await newNation.save();
  res.redirect("/dashboard");
});

router.get("/national/edit/:id", async (req, res) => {
  const nation = await Nation_food.findById(req.params.id);
  res.render("Form_nation", { nation: nation });
});

router.post("/national/update/:id", async (req, res) => {
  try {
    const { nation } = req.body;
    const updatedNationFood = await Nation_food.findByIdAndUpdate(
      req.params.id,
      { nation }
    );

    if (!updatedNationFood) {
      return res.status(404).send("Nation not found");
    }

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/national/delete/:id", async (req, res) => {
  await nation.findByIdAndDelete(req.params.id);
  res.redirect("/dashboard");
});

module.exports = router;
