const mysql = require('mysql2/promise');
const { createTableQueries, createForeignKeys, createTriggers, createUsersBackup } = require('./dbDefault');
const { insertDefaultValues, insertDefaulConditions, insertDefaultUser, insertDefaultUserPermissions, insertDefaultBackup } = require('./dbInsert');

(async () => {
    try {
        const con = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        // Criar banco de dados 'lgpd'
        await con.query("CREATE DATABASE IF NOT EXISTS lgpd");
        await con.query("USE lgpd");

        // Verificar tabelas existentes
        const [rows] = await con.query("SHOW TABLES");
        const tables = rows.map(row => Object.values(row)[0]);

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

        // Criar tabelas
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

        // Função para verificar e inserir valores padrão
        const insertIfEmpty = async (tableName, insertQuery) => {
            const [result] = await con.query(`SELECT COUNT(*) AS count FROM ${tableName}`);
            if (result[0].count === 0) {
                await con.query(insertQuery);
                console.log(`Valores padrões inseridos em ${tableName}`);
            } else {
                console.log(`Valores já existentes em ${tableName}, inserção ignorada`);
            }
        };
        
        // Criar triggers
        for (const trigger of Object.keys(createTriggers)) {
            await con.query(createTriggers[trigger]);
            console.log(`Trigger ${trigger} criada com sucesso`);
        }
        
        // Inserir valores padrões nas tabelas
        await insertIfEmpty('termos', insertDefaultValues.termos);
        await insertIfEmpty('condicoes', insertDefaulConditions.conditions);
        await insertIfEmpty('users', insertDefaultUser.users);
        await insertIfEmpty('usuario_termo', insertDefaultUserPermissions.permissions);
        await insertIfEmpty('aceites', insertDefaultUserPermissions.aceites);

        // Criar banco de dados 'lgpd_backup'
        await con.query("CREATE DATABASE IF NOT EXISTS lgpd_backup");
        await con.query("USE lgpd_backup");

        // Criar tabela de backup de usuários
        if (createUsersBackup.usersBackup) {
            await con.query(createUsersBackup.usersBackup);
            console.log("Tabela de backup 'users' criada no banco de dados 'lgpd_backup'.");
        } else {
            console.error("Query para criar tabela de backup 'users' não encontrada.");
        }

        // Inserir valores padrões nas tabelas
        await insertIfEmpty('users', insertDefaultBackup.users);

        await con.end();
    } catch (err) {
        console.error("Erro:", err);
    }
})();
