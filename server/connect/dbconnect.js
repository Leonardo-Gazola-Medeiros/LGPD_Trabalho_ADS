const mysql = require('mysql2');
require('dotenv').config();

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "lgpd"
});

const con_backup = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "lgpd_removed_users"
});

// Connect to the database
con.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco principal:', err);
    return;
  }
  console.log('Conexão bem sucedida com o banco principal');
});

con_backup.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de backup:', err);
    return;
  }
  console.log('Conexão bem sucedida com o banco de backup');
});

module.exports = { con, con_backup };
