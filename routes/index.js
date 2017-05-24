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

   var stmt = 'select MG.GROUP_NO, COUNT(*) CNT, M.MEMBER_NAME from MEMBER_TB M, MEMBER_GROUP_TB MG'
               +  ' where M.EMAIL = "' + email + '" AND M.PASSWORD = "'  + password + '"'
               + ' AND MG.MEMBER_NO = M.MEMBER_NO';
  pool.getConnection(function (err, connection) {
    var query_result = connection.query(stmt, function(err, rows) {
      if (err) {
        console.log(err);
      }
      console.log(rows);
      var cnt = rows[0].CNT;
      var name = rows[0].MEMBER_NAME;
      var group_no = rows[0].GROUP_NO;

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
