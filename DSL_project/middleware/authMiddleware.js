const User = require('../model/user');

const authMiddleware = (req, res, next) => {
    User.findById(req.session.userId).then((user) => {
        if (!user) {
            return res.redirect('/page_1')
        }

        if(user.role !== 'admin') {
            return res.redirect('/page_1')
        }
        console.log('User logged in successfully')
        next()

    }).catch((err) => {
        console.error(err);
    });
    
};

module.exports = authMiddleware;
