const createTableQueries = {
    user: `
        CREATE TABLE users (
            id integer PRIMARY KEY,
            username varchar(255),
            senha varchar(255),
            email varchar(200)
        );
    `,

    mensagens: `
        CREATE TABLE mensagens (
            data timestamp,
            mensagem varchar(300),
            id_user integer
    );
    `,

    termos: `
        CREATE TABLE termos (
            versao integer PRIMARY KEY,
            texto longtext
);
    `,

    condicoes: `
        CREATE TABLE condicoes (
            id_condicao integer PRIMARY KEY,
            versao_termo integer,
            nome varchar(30),
            obrigatorio bool
);
    `,

    aceites: `
        CREATE TABLE aceites (
            id_user integer,
            id_condicao integer,
            aceite bool
);
    `,

    foreign_keys: `
        ALTER TABLE users ADD FOREIGN KEY (id) REFERENCES mensagens (id_user);

        ALTER TABLE condicoes ADD FOREIGN KEY (versao_termo) REFERENCES termos (versao);

        ALTER TABLE aceites ADD FOREIGN KEY (id_condicao) REFERENCES condicoes (id_condicao);

        ALTER TABLE aceites ADD FOREIGN KEY (id_user) REFERENCES users (id);
    `
};

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

ALTER TABLE `users` ADD FOREIGN KEY (`id`) REFERENCES `mensagens` (`id_user`);

ALTER TABLE `condicoes` ADD FOREIGN KEY (`versao_termo`) REFERENCES `termos` (`versao`);

ALTER TABLE `aceites` ADD FOREIGN KEY (`id_condicao`) REFERENCES `condicoes` (`id_condicao`);

ALTER TABLE `aceites` ADD FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);

*/

module.exports = createTableQueries