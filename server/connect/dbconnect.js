const mysql = require('mysql2');

const con = mysql.createConnection({
  host: "localhost",
  user: "lgpd",
  password: "lgpd",
  database: "lgpd"
});


// Connect to the database
con.connect((err) => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }
  console.log('Conexão bem sucedida');
});


module.exports = con;