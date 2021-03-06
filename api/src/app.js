'use strict';

var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// routes
var routes = require('./routes/index');
var sessions = require('./routes/sessions');

var app = express();

var User = require('./model/user');
var Session = require('./model/session');

var dummyUsername = 'arthur@nudge.com';
User.findOne({username: dummyUsername}).then(function(user) {
  if (!user)
    new User({username: dummyUsername, password: 'password'}).save();
});

Session.findOne({name:"aaaaa"}).then(function(session){
  if (!session) new Session({
    name:"aaaaa",
    items: [
      {
        name: 'Item 1aaaaa',
        description: 'Lorem Ipsum',
        estimates: [4, 10, 23, 9]
      },
      {
        name: 'Item number 2',
        description: 'Lorem Ipsum hfhfhfhf'
      },
      {
        name: 'I am 3',
        description: 'Lorem asdfasdf Ipsum',
        estimates: [8, 0, 3456]
      },
      {
        name: 'Four',
        description: 'Lorem 444444444 v  44 4 4 4Ipsum'
      }
    ],
    activeItem: {
      id:1,
      name: 'Item 1',
      description: 'Lorem Ipsum',
      estimates: [4, 10, 23, 9]
    }
  }).save();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// cross origin headers
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Auth-Token, Content-Type');
  next();
});

app.use('/', routes);
app.use('/sessions', sessions);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;
