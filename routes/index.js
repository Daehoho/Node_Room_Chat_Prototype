var express = require('express');
var JSON = require("JSON");
var path = require('path');
var router = express.Router();

//-------------------- db connect --------------- //
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.post('/chat', function (req, res, next) {
  req.accepts('application/json');
  
  var body = req.body

  res.render('chat', {nickname: body.nickname, room: body.room});
});

router.get('/login', function(req, res, next) {
  res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.post('/login', function(req, res, next) {
  req.accepts('application/json');

  var body = req.body;
  var stmt = 'select count(*) from member_tb where email = "' + body.email + '" AND password = "'  + body.password + '"';
  // var stmt = "select * from member_tb";

  var query = connection.query(stmt, function(err, rows) {
    if(err) {
      console.log(err);
      return;
    }
    console.log(rows);
    var cnt = rows[0].cnt;
  
    if(cnt == 1) {
      req.session.key = body.email;
      res.end('done');
    } else {
      // alert("wrong information");
      res.redirect('/login');
    }
  });
  console.log(query);
});

// router.post('/chat', function (req, res, next) {
//   req.accepts('application/json');

//   console.log("1:" + req.body.room);
//   var key = req.body.room;
//   var value = JSON.stringify(req.body);
//   console.log(key);

//   client.set(key, value, function(err, data) {
//     if(err) {
//       console.log(err);
//       res.send("error" + err);
//       return;
//     }
//     client.expire(key, 100);
//     // res.json(value);
//     res.redirect("/chat/"+ key);
//   });
// });

// router.get('/chat/:room', function(req, res, next) {
//   //console.log("room name is : " +  req.params.room);
//   var key = req.params.room;

//   client.get(key, function (err,data) {
//     if(err) {
//       console.log(err);
//       res.send("error " + err);
//       return;
//     }
//     var value = JSON.parse(data);
//     res.render('chat', { nickname: value.nickname, room: req.params.room });
//   })
// });


module.exports = router;
