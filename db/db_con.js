var mysql = require('mysql');
var config = require('../db/db_info')().local;


module.exports = function() {
    // console.log(config);
    return {
        init: function() {
            return mysql.createConnection({
                host: config.host, 
                port: config.port,
                user: config.user,
                password: config.password,
                database: config.database
            })
        },
        create_pool: function() {
            return mysql.createPool({
                connectionLimit: 50,
                host : config.host,
                user : config.user,
                password : config.password,
                port: config.port,
                database : config.database
            });
        },
        test_open : function (pool) {
            pool.getConnection(function (err, connection) {
                if(err) {
                    console.log('mysql connection error : ' + err);
                } else {
                    console.log('mysql is connected successfully');
                    connection.release();
                }
            })
        }
    }
}