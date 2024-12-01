var express = require('express');
const Food = require('../model/food');
const nation = require('../model/nation_food');
const Category = require('../model/catagory');

var router = express.Router();

router.get('/', async function (req, res) {
    var foods = [];

    if (req.session.userId) {
        foods = await Food.find({ user: req.session.userId }, { name: 1, nation_id: 1, catagory_id: 1 });
    } else {
        foods = await Food.find({ user: null }, { name: 1, nation_id: 1, catagory_id: 1 });
    }

    const nationIds = [...new Set(foods.map(food => food.nation_id).filter(Boolean))];
    const categoryIds = [...new Set(foods.map(food => food.catagory_id).filter(Boolean))];

    const nations = await nation.find({ _id: { $in: nationIds } });
    const categories = await Category.find({ _id: { $in: categoryIds } });

    console.log(foods);

    res.render('page_2', { title: 'Home', foods, categories, nations });
});

router.get('/addfood', async (req, res) => {
    const nations = await nation.find();
    const categories = await Category.find();
    res.render('form_food1', { food: null, nations, categories });
});

router.post('/addfood', async (req, res) => {

    const { name, calories, description, taste, nation_id, catagory_id } = req.body;

    if (!req.session.userId) {
       
        const newFood = new Food({
            name,
            calories,
            description,
            taste,
            nation_id,
            catagory_id,
        });
        
        await newFood.save();
        res.redirect('/page_2');
    }else {

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
        res.redirect('/page_2');
    }
});

router.get('/food/:id', async (req, res) => {
    
    try {
        let foodItem;
       
            foodItem = await Food.findById(req.params.id)
                .populate('nation_id')
                .populate('catagory_id');

        const nations = await nation.find();
        const categories = await Category.find();

        res.render('Foodinfo', { food: foodItem, nations, categories, loggedIn });
    } catch (error) {
        console.error('Error fetching food item:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/edit/:id", async (req, res) => {
    
    try {

      const food = await Food.findById(req.params.id)
        .populate("nation_id")
        .populate("catagory_id");
      const nations = await nation.find();
      const categories = await Category.find();
  
      res.render("Form_food1", { food, nations, categories });
    } catch (error) {
      console.error("Error fetching food item:", error);
      res.status(500).send("Error fetching food item");
    }
  });
  
  router.post("/update/:id", async (req, res) => {
    const { name, calories, description, taste, nation_id, catagory_id } = req.body;

        const updatedFood = await Food.findByIdAndUpdate(req.params.id, {
            name,
            calories,
            description,
            taste,
            nation_id,
            catagory_id,
        }, { new: true });

        if (!updatedFood) {
            return res.status(404).send("Food item not found.");
        }

    res.redirect("/page_2");
});
  
router.get("/delete/:id", async (req, res) => {

        await Food.findByIdAndDelete(req.params.id);

    res.redirect("/page_2");
});

router.post('/deletefood', async function (req, res, next) {
    
    try {
        const name = req.body; 

        const result = await Food.findOneAndDelete(name);

        if (result) {
            res.send(`Food item '${name}' has been deleted.`);
        } else {
            res.send(`Food item '${name}' not found.`);
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
