var port = 6379;
var host = '127.0.0.1';

var redis = require("redis");
var redisClient = redis.createClient(port, host);

// redisClient.auth({password}, function(err) {
//     if (err) throw err;
// })

redisClient.on('error', function(err) {
    console.log('Redis error: ' + err);
});

module.exports = redisClient;
