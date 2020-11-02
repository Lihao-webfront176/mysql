module.exports = (sql, connect) => {
    return new Promise(function (resolve, reject) {
	    var mysql = require('mysql');
	    var connection = mysql.createConnection(connect);;
	    connection.connect();
	    connection.query(sql, (err, results) => {
	        if (results) {
	            resolve(results);
	        }
	        if (err) {
	            console.log(err);
	        }
	        connection.end();
	    });
	});
};