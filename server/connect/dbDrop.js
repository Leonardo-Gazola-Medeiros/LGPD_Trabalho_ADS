var mysql = require('mysql2');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "senha",
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