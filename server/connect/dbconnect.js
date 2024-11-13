const mysql = require('mysql2');
require('dotenv').config();

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
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