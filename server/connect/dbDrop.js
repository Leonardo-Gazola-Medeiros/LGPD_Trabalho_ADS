var mysql = require('mysql2');

var con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Conectado");
	
	var sql = "DROP DATABASE lgpd";
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log("Database lgpd deletada");
	
	var sql ='DROP DATABASE lgpd_removed_users';
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log('tudo deletado');
		
		
		con.end();
	});	
	});
});