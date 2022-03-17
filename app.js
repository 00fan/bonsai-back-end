var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var seedlingRouter = require('./routes/seedling');
var buy_seedlingRouter = require('./routes/buy-seedling');
var cultivationRouter=require('./routes/cultivation');
var cultivateRouter=require('./routes/cultivate')
var cultivatedRouter=require('./routes/cultivated')
var FGRouter=require('./routes/finished-goods')
var sellRouter=require('./routes/sell')
var soldRouter=require('./routes/sold')
var moneyRouter=require('./routes/money')
var employeeRouter=require('./routes/employee')

var cors = require('cors')



//mongodb
require('./db/index')
var app = express();
//跨域
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/seedling', seedlingRouter);
app.use('/buySeedling', buy_seedlingRouter);
app.use('/cultivation',cultivationRouter);
app.use('/cultivate',cultivateRouter);
app.use('/cultivated',cultivatedRouter);
app.use('/fg',FGRouter)
app.use('/sell',sellRouter);
app.use('/sold',soldRouter);
app.use('/money',moneyRouter)
app.use('/employee',employeeRouter)
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
