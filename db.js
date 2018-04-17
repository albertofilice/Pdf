var mysql = require('mysql');
var connection = mysql.createConnection({
      		  host     : 'localhost',
              user     : 'test',
              password : 'test_123',
              database : 'test',
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

});

module.exports = connection;