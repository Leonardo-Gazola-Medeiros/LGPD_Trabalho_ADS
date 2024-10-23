const mysql = require('mysql2/promise');  // Usando o módulo 'promise' para trabalhar com async/await
const { createTableQueries, createForeignKeys } = require('./dbDefault');
const { insertDefaultValues, insertDefaulConditions, insertDefaultUser } = require('./dbInsert');  // Importa os valores padrões a serem inseridos

(async () => {
    try {
        const con = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "senha",
        });

        // Criar banco de dados 'lgpd'
        await con.query("CREATE DATABASE IF NOT EXISTS lgpd");
        await con.query("USE lgpd");

        // Verificar tabelas existentes
        const [rows] = await con.query("SHOW TABLES");
        const tables = rows.map(row => Object.values(row)[0]);

        // Função para criar tabelas se elas não existirem
        const createTableIfNotExists = async (tableName, createQuery) => {
            if (!tables.includes(tableName)) {
                if (createQuery) {
                    await con.query(createQuery);
                    console.log(`Tabela ${tableName} criada com sucesso`);
                } else {
                    console.error(`Nenhuma query de criação encontrada para ${tableName}`);
                }
            } else {
                console.log(`Tabela ${tableName} já existe`);
            }
        };

        // Iterar sobre as queries de criação de tabelas
        for (const tableName of Object.keys(createTableQueries)) {
            const createQuery = createTableQueries[tableName];
            await createTableIfNotExists(tableName, createQuery);
        }

        console.log("Estrutura padrão do banco de dados criada");

        // Criar chaves estrangeiras
        for (const fkName of Object.keys(createForeignKeys)) {
            await con.query(createForeignKeys[fkName]);
            console.log(`${fkName} criada com sucesso`);
        }

        // Inserir valores padrões
        for (const table of Object.keys(insertDefaultValues)) {
            await con.query(insertDefaultValues[table]);
            console.log(`Valores padrões inseridos em ${table}`);
        }

        for (const table of Object.keys(insertDefaulConditions)) {
            await con.query(insertDefaulConditions[table]);
            console.log(`condicoes padrões inseridos em ${table}`);
        }
        for (const table of Object.keys(insertDefaultUser)) {
            await con.query(insertDefaultUser[table]);
            console.log(`usuarios padrões inseridos em ${table}`);
        }

        // Criar banco de dados 'lgpd_removed_users' e tabela 'users'
        await con.query("CREATE DATABASE IF NOT EXISTS lgpd_removed_users");
        await con.query("USE lgpd_removed_users");
        await createTableIfNotExists("users", "CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, email VARCHAR(200))");
        console.log("Estrutura padrão do banco de dados 'lgpd_removed_users' criada");

        await con.end();  // Fechar a conexão no final de todas as operações
    } catch (err) {
        console.error("Erro:", err);
    }
})();
