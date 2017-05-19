var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/:room', function(req, res, next) {
  console.log("room name is : " +  req.params.room);
  res.render('index', {room:req.params.room});
});

module.exports = router;
