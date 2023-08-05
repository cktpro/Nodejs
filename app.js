const { default: mongoose } = require("mongoose");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var writeWelcome = require('./routes/welcome');
var productsRouter=require('./routes/products/router')
var categoryRouter=require('./routes/category/router')
var suppliersRouter=require('./routes/suppliers/router')
var customersRouter=require('./routes/customers/router')
var employeesRouter=require('./routes/employees/router')
var orderRouter=require('./routes/orders/router')
var questionRouter=require('./routes/questions/router')
require('dotenv').config()
console.log(process.env)
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.URI);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/welcomes', writeWelcome);
app.use('/category', categoryRouter);
app.use('/suppliers', suppliersRouter);
app.use('/customers', customersRouter);
app.use('/employees', employeesRouter);
app.use('/orders', orderRouter);
app.use('/questions', questionRouter);
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
