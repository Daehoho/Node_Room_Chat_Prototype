var mysql = require('mysql');
var config = require('../db/db_info').local;

module.exports = function() {
    return {
        init: function() {
            return mysql.createConnection({
                host: 'localhost',
                port: '3306',
                user: 'test',
                password: 'test',
                database: 'test'
            })
        },

        test_open: function (con) {
            con.connect(function(err) {
                if(err) {
                    console.log('mysql connection error : ' + err);
                } else {
                    console.log('mysql is connected successfully');
                }
            })
        }
    }
}