var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var SocketIo = require('socket.io');
var socketEvents = require('./socket.js');

var session = require('express-session');
var redis = require('redis');
var redisStore = require('connect-redis')(session);
var client = redis.createClient();
// var client = require('./redis_connect.js');

var index = require('./routes/index');
var users = require('./routes/users');
var sessions = require('./routes/sessions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session(
  {
    secret: 'secret_key',
    store: new redisStore({
      host : "127.0.0.1",
      port: 6379,
      client: client,
      prefix: "session:",
      db : 0
    }),
    saveUninitialized: false,
    resave: true
  }
));

app.use('/', index);
app.use('/session', sessions(session));
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

const server = app.listen(3000, function() {
  console.log('Express App on port 3000!');
});

const io = new SocketIo(server);

socketEvents(io);


module.exports = app;
