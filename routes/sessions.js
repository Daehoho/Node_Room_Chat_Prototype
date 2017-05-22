var express = require("express");
var path = require("path");
var router = express.Router();

module.exports = function(session) {

    router.get('/', function(req, res, next) {
        if(req,session.key) {
            console.log("success");
            console.log(req.session.key);
        } else {
            res.render('index.html');
        }
    });
    router.get('/set/:value', function (req, res) {
        req.session.redSession = req.params.value;
        res.send('session written in Redis successfully');
    });

    router.get('/get/', function (req, res) {
        if (req.session.redSession)
            res.send('the Session value stored in Redis is: ' + req.session.redSess);
        else
            res.send('no session value stored in Redis');
    });

    return router;
}
