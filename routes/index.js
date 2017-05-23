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

router.get('/chat', function (req, res, next) {
  if(req.session.user_email) {
    res.render('chat', {nickname: req.session.name, room: req.session.group_no })
  } else {
    res.send('<script>alert("no session information");location.href("/login");</script>');
  }
});

// router.post('/chat', function (req, res, next) {
//   req.accepts('application/json');
  
//   var body = req.body

//   res.render('chat', {nickname: body.nickname, room: body.room});
// });

router.get('/login', function(req, res, next) {
  res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.post('/login', function(req, res, next) {
  req.accepts('application/json');

  var email = req.body.email;
  var password = req.body.password;

  var stmt = 'select mg.group_no, count(*) cnt, m.name from member_tb m, member_group_tb mg'
              +  ' where m.email = "' + email + '" AND m.password = "'  + password + '"'
              + ' AND mg.member_no = m.member_no';
  // var stmt = "select * from member_tb";

  var query = connection.query(stmt, function(err, rows) {
    if(err) {
      console.log(err);
    }
    console.log(rows);
    var cnt = rows[0].cnt;
    var name = rows[0].name;
    var group_no = rows[0].group_no;

    if(cnt == 1) {
      req.session.user_email = email;
      req.session.name = name;
      req.session.group_no = group_no;
      console.log(req.session);
      res.send('<script>alert("pass!");location=href="/chat";</script>');
    } else {
      res.json({result: 'fail'});
      res.send('<script>alert("wrong information");history.back();</script>')
    }
  });
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
