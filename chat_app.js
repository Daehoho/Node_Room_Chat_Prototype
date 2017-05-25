// ============================  Express Basic Settings ============================ //
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// ============================  Import About Socket.io  ============================ //
var SocketIo = require('socket.io');
var socketEvents = require('./socket.js');

// ============================  Import About Redis ============================ //
var session = require('express-session');
var redis_config = require('./redis/redis_info')().daou_server;
var redis = require('./redis/redis');
var redisStore = require('connect-redis')(session);


// ============================  Import About Routes ============================ //
var index = require('./routes/index');
var users = require('./routes/users');

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

// express-session 
// app.use(session({
//   secret: 'daeho',
//   resave: false,
//   saveUninitialized: true
// }));

// redis-session
app.use(session(
  {
    secret: 'scecret_key',
    store: new redisStore({
      host: redis_config.host,
      port: redis_config.port,
      client: redis,
      prefix: "session:",
      db: 0,
      ttl: 10800
    }),
    cookie: { maxAge: 10800 },
    saveUninitialized: false,
    resave: true
  }
));


app.use('/', index);
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
