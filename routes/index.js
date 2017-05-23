var express = require('express');
var JSON = require("JSON");
var path = require('path');
var router = express.Router();

//-------------------- db connect --------------- //
var mysql_dbc = require('../db/db_con')();
var pool = mysql_dbc.create_pool();
mysql_dbc.test_open(pool);


router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.post('/login', function(req, res, next) {
  req.accepts('application/json');

  var email = req.body.email;
  var password = req.body.password;

   var stmt = 'select mg.group_no, count(*) cnt, m.name from member_tb m, member_group_tb mg'
               +  ' where m.email = "' + email + '" AND m.password = "'  + password + '"'
               + ' AND mg.member_no = m.member_no';
  pool.getConnection(function (err, connection) {
    var query_result = connection.query(stmt, function(err, rows) {
      if (err) {
        console.log(err);
      }
      console.log(rows);
      var cnt = rows[0].cnt;
      var name = rows[0].name;
      var group_no = rows[0].group_no;

      if (cnt == 1) {
        req.session.user_email = email;
        req.session.name = name;
        req.session.group_no = group_no;
        console.log(req.session);
        res.send('<script>alert("pass!");location=href="/chat";</script>');
      } else {
        res.send('<script>alert("wrong information");history.back();</script>')
      }
      connection.release();
    });
  });

});

router.get('/chat', function (req, res, next) {
  if(req.session.user_email) {
    res.render('chat', {nickname: req.session.name, room: req.session.group_no })
  } else {
    res.send('<script>alert("no session information");location.href("/login");</script>');
  }
});

module.exports = router;
