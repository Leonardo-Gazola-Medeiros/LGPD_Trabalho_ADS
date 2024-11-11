const createTableQueries = {
  users: `
      CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(255),
      senha VARCHAR(255),
      email VARCHAR(200)
      );
  `,

  mensagens: `
      CREATE TABLE IF NOT EXISTS mensagens (
      data TIMESTAMP,
      mensagem VARCHAR(300),
      id_user INT
      );
  `,

  termos: `
    CREATE TABLE IF NOT EXISTS termos (
    version INT PRIMARY KEY AUTO_INCREMENT,
    texto LONGTEXT
);
  `,

  condicoes: `
      CREATE TABLE IF NOT EXISTS condicoes (
      id_condicao INT PRIMARY KEY AUTO_INCREMENT,
      version_id INT,
      nome LONGTEXT,
      obrigatorio BOOL
      );
  `,

  aceites: `
      CREATE TABLE IF NOT EXISTS aceites (
      id_user INT,
      id_condicao INT,
      aceite BOOL
      );
  `,


  usuario_termo: `
  CREATE TABLE IF NOT EXISTS usuario_termo (
    id_user INT,
    id_termo INT,
    aceito BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_user, id_termo),
    FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (id_termo) REFERENCES termos(version) ON DELETE CASCADE
);

  `
};

const createForeignKeys = {
  fk_mensagens: `
      ALTER TABLE mensagens 
      ADD FOREIGN KEY (id_user) REFERENCES users(id)
      ON DELETE CASCADE;
    `,

  fk_condicoes: `
      ALTER TABLE condicoes 
      ADD FOREIGN KEY (version_id) REFERENCES termos(version);
  `,

  fk_aceites1: `
      ALTER TABLE aceites 
      ADD FOREIGN KEY (id_condicao) REFERENCES condicoes(id_condicao);
  `,

  fk_aceites2: `
      ALTER TABLE aceites 
      ADD FOREIGN KEY (id_user) REFERENCES users(id)
      ON DELETE CASCADE;
  `
};


const createTriggers = {
  termoUsuarioTrigger: `
    CREATE TRIGGER IF NOT EXISTS after_termo_insert
    AFTER INSERT ON termos
    FOR EACH ROW
    BEGIN
        INSERT INTO usuario_termo (id_user, id_termo, aceito)
        SELECT id, NEW.version, FALSE FROM users;
    END 
`
}

module.exports = { createTableQueries, createForeignKeys, createTriggers };

/*

CREATE TABLE `termos` (
  `versao` integer PRIMARY KEY,
  `texto` longtext
);

CREATE TABLE `condicoes` (
  `id_condicao` integer PRIMARY KEY,
  `versao_termo` integer,
  `nome` varchar(30),
  `obrigatorio` bool
);

CREATE TABLE `aceites` (
  `id_user` integer,
  `id_condicao` integer,
  `aceite` bool
);

CREATE TABLE `users` (
  `id` integer PRIMARY KEY,
  `username` varchar(255),
  `senha` varchar(255),
  `email` varchar(200)
);

CREATE TABLE `mensagens` (
  `data` timestamp,
  `mensagem` varchar(300),
  `id_user` integer
);

ALTER TABLE `mensagens` ADD FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);

ALTER TABLE `condicoes` ADD FOREIGN KEY (`versao_termo`) REFERENCES `termos` (`versao`);

ALTER TABLE `aceites` ADD FOREIGN KEY (`id_condicao`) REFERENCES `condicoes` (`id_condicao`);

ALTER TABLE `aceites` ADD FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);

*/

