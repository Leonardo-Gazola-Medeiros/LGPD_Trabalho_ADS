const mysql = require('mysql2');
const { createTableQueries, createForeignKeys } = require('./dbDefault');
const { insertDefaultValues } = require('./dbInsert');  // Importa os valores padrões a serem inseridos

const con = mysql.createConnection({
    host: "localhost",
    user: "lgpd",
    password: "lgpd",
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

            // Função para criar tabelas se elas não existirem
            const createTableIfNotExists = (tableName, createQuery) => {
                if (!tables.includes(tableName)) {
                    if (createQuery) {
                        con.query(createQuery, function (err, result) {
                            if (err) throw err;
                            console.log(`Tabela ${tableName} criada com sucesso`);
                        });
                    } else {
                        console.error(`Nenhuma query de criação encontrada para ${tableName}`);
                    }
                } else {
                    console.log(`Tabela ${tableName} já existe`);
                }
            };

            // Itera sobre as queries de criação de tabelas
            Object.keys(createTableQueries).forEach(tableName => {
                const createQuery = createTableQueries[tableName];
                createTableIfNotExists(tableName, createQuery);
            });

            console.log("Estrutura padrão do banco de dados criada");

            // Após criar as tabelas, adicione as chaves estrangeiras
            Object.keys(createForeignKeys).forEach(fkName => {
                con.query(createForeignKeys[fkName], function (err, result) {
                    if (err) throw err;
                    console.log(`${fkName} criada com sucesso`);
                });
            });

            // Insere valores padrões após criar as tabelas e chaves estrangeiras
            Object.keys(insertDefaultValues).forEach(table => {
                con.query(insertDefaultValues[table], function (err, result) {
                    if (err) throw err;
                    console.log(`Valores padrões inseridos em ${table}`);
                });
            });

            con.end();  // Encerra a conexão após finalizar todas as operações

        });
    });
});
