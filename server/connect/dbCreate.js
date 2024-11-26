const mysql = require('mysql2/promise');
const { createTableQueries, createForeignKeys, createTriggers, createRemovedUsers } = require('./dbDefault');
const { insertDefaultValues, insertDefaulConditions, insertDefaultUser, insertDefaultUserPermissions, insertDefaultBackup } = require('./dbInsert');

(async () => {
    try {
        const con = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        // Criar bancos de dados 'lgpd' e 'lgpd_removed_users'
        await con.query("CREATE DATABASE IF NOT EXISTS lgpd");
        await con.query("CREATE DATABASE IF NOT EXISTS lgpd_removed_users");

        // Configurar conexão para 'lgpd' e criar tabelas e chaves estrangeiras
        await con.query("USE lgpd");

        // Verificar tabelas existentes no banco 'lgpd'
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

        // Criar tabelas no banco 'lgpd'
        for (const tableName of Object.keys(createTableQueries)) {
            const createQuery = createTableQueries[tableName];
            await createTableIfNotExists(tableName, createQuery);
        }

        // Criar chaves estrangeiras no banco 'lgpd'
        for (const fkName of Object.keys(createForeignKeys)) {
            await con.query(createForeignKeys[fkName]);
            console.log(`${fkName} criada com sucesso`);
        }

        // Criar triggers no banco 'lgpd'
        for (const trigger of Object.keys(createTriggers)) {
            await con.query(createTriggers[trigger]);
            console.log(`Trigger ${trigger} criada com sucesso`);
        }

        console.log("Estrutura padrão do banco de dados 'lgpd' criada");

        // Configurar conexão para 'lgpd_removed_users' e criar tabela de backup de usuários
        await con.query("USE lgpd_removed_users");

        if (createRemovedUsers) {
            await con.query(createRemovedUsers.removedUsers);
            console.log("Tabela 'users' de backup criada no banco de dados 'lgpd_removed_users'.");
        } else {
            console.error("Query para criar tabela 'users' de backup não encontrada.");
        }

        // Retornar à conexão para o banco 'lgpd' para inserir dados padrão
        await con.query("USE lgpd");

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

        // Inserir valores padrão nas tabelas do banco 'lgpd'
        await insertIfEmpty('termos', insertDefaultValues.termos);
        await insertIfEmpty('condicoes', insertDefaulConditions.conditions);
        await insertIfEmpty('users', insertDefaultUser.users);
        await insertIfEmpty('usuario_termo', insertDefaultUserPermissions.permissions);
        await insertIfEmpty('aceites', insertDefaultUserPermissions.aceites);

        console.log("Dados padrão inseridos nas tabelas do banco de dados 'lgpd'.");

        // Conectar ao banco 'lgpd_removed_users' para verificar IDs e remover usuários no banco 'lgpd'
        const conRemovedUsers = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'lgpd_removed_users'
        });

        const [removedUserIds] = await conRemovedUsers.query("SELECT id FROM users");
        
        if (removedUserIds.length > 0) {
            const idsToRemove = removedUserIds.map(row => row.id).join(',');
            await con.query(`DELETE FROM users WHERE id IN (${idsToRemove})`);
            console.log(`Usuários com IDs ${idsToRemove} removidos do banco de dados 'lgpd'.`);
        } else {
            console.log("Nenhum usuário removido encontrado no banco de dados 'lgpd_removed_users'.");
        }

        await conRemovedUsers.end();
        await con.end();
    } catch (err) {
        console.error("Erro:", err);
    }
})();
