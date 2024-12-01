const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

const router = express.Router();


const validateLogin = body => {
    if (!body.email || !body.password)
        throw new Error("Please filled username or password !");
};








// Show Register Page
router.get('/register', (req, res) => {
    res.render('register');
});

// Register Route
router.post('/register',(req, res) => {
    const { name, email, password,role } = req.body;

    try {
        
        user = new User({ name, email, password,role });
        user.save();

        res.redirect('/login');

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Show Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Login Route
router.post('/login', (req, res) => {

    validateLogin(req.body);
    const { email, password } = req.body;

        // Find the user by email
        const user = User.findOne({ email: email }).then((user) => {
            console.log(user)

            if (user) {
                let cmp = bcrypt.compare(password, user.password).then((match) => {
                    if (match) {
                        req.session.userId = user._id
                        if (user.role === 'user') {
                            res.redirect("/page_1");
                        }else if(user.role === 'admin'){
                            res.redirect("/dashboard");
                        }


                        
                    } else {
                        res.redirect('/login')
                    }
                })
            } else {
                res.redirect('/login')
            }
        })
    
});



// Logout Route
router.get('/logout', (req,res) => {
    req.session.destroy(()=>{
        res.redirect('/')
    })  
});

router.get('/profile',async (req, res) => {

    let UserData = await User.findById(req.session.userId);
    res.render('profile', { user: UserData });

});

module.exports = router;
