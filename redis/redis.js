var redis = require("redis");
var config = require('./redis_info')().daou_server;

var redisClient = redis.createClient(config.port, config.port);

if (config.password != undefined) {
    redisClient.auth(config.password, function (err) {
        if (err) throw err;
    });
};

redisClient.on('error', function(err) {
    console.log('Redis error: ' + err);
});

module.exports = redisClient;
