var express = require('express');
var JSON = require("JSON");
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
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

router.post('/chat', function (req, res, next) {
  req.accepts('application/json');
  
  var body = req.body

  res.render('chat', {nickname: body.nickname, room: body.room});
});


module.exports = router;
