var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var statecityRouter = require('./routes/statecity');
var restaurantRouter = require('./routes/restaurant');
var categoryRouter = require('./routes/category');
var superAdminRouter = require('./routes/superadmin')
const fooditemRouter=require('./routes/fooditem');
const tablebookingRouter=require('./routes/tablebooking');
const waiterRouter=require('./routes/waiter');
const adminRouter=require('./routes/admin');
const waitertableRouter=require('./routes/waitertable')
const billingRouter=require('./routes/billing');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/statecity', statecityRouter);
app.use('/restaurants', restaurantRouter);
app.use('/category', categoryRouter);
app.use('/superadmin', superAdminRouter);
app.use('/fooditem',fooditemRouter);
app.use('/tablebooking',tablebookingRouter);
app.use('/waiter',waiterRouter);
app.use('/admin',adminRouter);
app.use('/waitertable',waitertableRouter)
app.use('/billing',billingRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
