const createTableQueries = {
    user: `
        CREATE TABLE IF NOT EXISTS user (
            id_user INT PRIMARY KEY AUTO_INCREMENT,
            nome_usuario VARCHAR(256) NOT NULL,
            email_usuario VARCHAR(256) NOT NULL,
            senha_usuario VARCHAR(256) NOT NULL,
            userPhoto VARCHAR(512)
        );
    `,

    mensagens: `
        CREATE TABLE IF NOT EXISTS mensagens (
            id_user INT,
            mensagem VARCHAR(300),
            FOREIGN KEY (id_user) REFERENCES user(id_user) ON DELETE CASCADE
        );
    `
};