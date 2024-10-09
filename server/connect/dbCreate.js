const mysql = require('mysql2');
const { createTableQueries, createForeignKeys } = require('./dbDefault');  // Destructure to ensure correct object reference

const con = mysql.createConnection({
    host: "localhost" ,
    user: "lgpd" ,
    password: "lgpd" ,
});

con.query("CREATE DATABASE IF NOT EXISTS lgpd", function (err, result) {
    if (err) throw err;

    con.query("USE lgpd", function (err, result) {
        if (err) {
            console.error("Erro ao selecionar o banco de dados 'lgpd':", err);
            con.end();
            return;
        }

        con.query("SHOW TABLES", function (err, result) {
            if (err) throw err;

            const tables = result.map(row => Object.values(row)[0]);

            // Function to create tables if they don't exist
            const createTableIfNotExists = (tableName, createQuery) => {
                if (!tables.includes(tableName)) {
                    if (createQuery) {  // Check if query exists
                        con.query(createQuery, function (err, result) {
                            if (err) throw err;
                            console.log(`Tabela ${tableName} criada com sucesso`);
                        });
                    } else {
                        console.error(`No create query found for ${tableName}`);
                    }
                } else {
                    console.log(`Tabela ${tableName} já existe`);
                }
            };

            // Loop through the table creation queries
            Object.keys(createTableQueries).forEach(tableName => {
                const createQuery = createTableQueries[tableName]; // Fetch corresponding query
                createTableIfNotExists(tableName, createQuery);
            });

            console.log("Estrutura padrão do banco de dados criada");

            // After creating tables, add foreign keys
            Object.keys(createForeignKeys).forEach(fkName => {
            con.query(createForeignKeys[fkName], function (err, result) {
                if (err) throw err;
                console.log(`${fkName} criadas com sucesso`);
            });
            });
        });
    });
});


/*
Object.keys(initialInserts).forEach(table => {
    con.query(initialInserts[table], function (err, result) {
        if (err) throw err;
        console.log(`Insert ${table} criado com sucesso`);
    });
});
con.end();
} else {
console.log("O banco de dados 'lgpd' já possui tabelas");
con.end();
*/