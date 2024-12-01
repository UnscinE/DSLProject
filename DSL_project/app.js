const PORT = process.env.PORT || 555;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose'); 
const session = require('express-session');

// Route
var page1Router = require('./routes/page_1');
var page2Router = require('./routes/page_2');
var filter = require('./routes/filter');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const authMiddleware = require('./middleware/authMiddleware')

var app = express();
global.logedIn = null;

// เชื่อมต่อกับ MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger('dev'));
app.use(session({
  secret: "node secret"
}));
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId
  next()
})

//app.use('/', indexRouter);
app.use('/page_1', page1Router);
app.use('/page_2', page2Router);
app.use('/', filter);

//Home Page
app.use('/', page1Router);


//Authentication
app.use('/' ,authRoutes);

//Admin
app.use('/',authMiddleware,adminRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
