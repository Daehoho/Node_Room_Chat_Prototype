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

router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});
router.post('/login', function(req, res, next) {
  req.accepts('application/json');

  var user_info = {
    email : req.body.email,
    password : req.body.password
  };

  var stmt = "SELECT COUNT(*) CNT, MEMBER_NO, MEMBER_NAME, EMAIL FROM MEMBER_TB WHERE EMAIL=? AND PASSWORD=?";
  pool.getConnection(function (err, connection) {
   connection.query(stmt,[user_info.email, user_info.password],function(err, rows) {
      if (err) {
        console.log(err);
      }
      console.log("q_result: ");
      console.log(rows);
      var cnt = rows[0].CNT;
      var email = rows[0].EMAIL;
      var name = rows[0].MEMBER_NAME;
      var member_no = rows[0].MEMBER_NO;

      if (cnt == 1) {
        req.session.email = email;
        req.session.name = name;
        req.session.member_no = member_no;
        console.log(req.session);
        res.send('<script>alert("pass!");location=href="/group";</script>');
      } else {
        res.send('<script>alert("wrong information");history.back();</script>')
      }
      connection.release();
    });
  });

});

router.post('/chat', function (req, res, next) {
  var chat_info = {
    room : req.body.group_name,
    member_name : req.body.member_name
  }
  if(req.session.email) {
    res.render('chat', {nickname: chat_info.member_name, room: chat_info.room })
  } else {
    res.send('<script>alert("no session information");location.href("/login");</script>');
  }
});

router.get('/group', function (req, res, next) {
  if(req.session.email) {
    var user_info = {
      email : req.session.email,
      name : req.session.name,
      member_no : req.session.member_no
    }
    
    var stmt = "select GN.GROUP_NO, GROUP_NAME, GROUP_DESC, GROUP_IMG" + 
               " FROM GROUP_TB G," + 
                     " (select GROUP_NO from MEMBER_GROUP_TB where MEMBER_NO = ?) GN" +
               " WHERE G.GROUP_NO = GN.GROUP_NO";

    pool.getConnection(function(err, connection) {
      if(err) {
        console.log("connection err: " + err);
      }
      connection.query(stmt, [user_info.member_no], function(err, rows) {
        if(err) {
          console.log("query err : " + err);
        }
        console.log(rows);

        console.log(req.session);
        res.render('group', { user: user_info, groups: rows});
        connection.release();
      });
    })
  } else {
    res.send('<script>alert("no session information");location.href("/login");</script>');
  }
});

module.exports = router;
