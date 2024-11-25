const { con, con_backup } = require('../connect/dbconnect');

// --------- FUNÇÕES DO TERMO ---------- //

exports.InsertTerm = async (req, res) => {
    const { version, texto } = req.body;
    const query = 'INSERT INTO termos (version,texto) VALUES (?,?)'
    con.query(query, [version, texto], (error, results) => {
        if (error) {
            console.error("Error inserting term: ", error);
            return res.status(500).json({ error: 'Database error: ' + error.message })
        }
        res.status(201).json({ id: results.insertId })
    })
};

exports.getAllTerms = async (req, res) => {
    const query = 'SELECT * FROM termos WHERE version ORDER BY version DESC LIMIT 1';
    con.query(query, (error, results) => {
        if (error) {
            console.error("Error when getting terms: ", error);
            return res.status(500).json({ error: 'Database error: ' + error.message });
        }
        res.status(200).json(results);
    });
};

// --------- FUNÇÕES DAS CONDIÇÕES --------- //

exports.getAllConditions = async (req, res) => {
    const query = 'SELECT * FROM condicoes WHERE version_id ORDER BY version_id DESC LIMIT 1';
    con.query(query, (error, results) => {
        if (error) {
            console.error("Erro na busca das condições: ", error);
            return res.status(500).json({ error: 'Database error: ' + error.message });
        }
        res.status(200).json(results);
    });
};

exports.InsertCondition = async (req, res) => {
    const { version_id, nome, obrigatorio } = req.body;
    const query = 'INSERT INTO condicoes (version_id, nome, obrigatorio) VALUES (?,?,?)'
    con.query(query[version_id, nome, obrigatorio], (error, results) => {
        if (error) {
            console.error("Error inserting term: ", error);
            return res.status(500).json({ error: 'Database error: ' + error.message })
        }
        res.status(201).json({ id: results.insertId })
    });
};

// --------- FUNÇÕES DOS ACEITES DO USUARIO --------- //

exports.getAceites = async (req, res) => {
    const query = 'SELECT * FROM condicoes WHERE id_user = ? AND WHERE id_condicao = (WHERE condicoes.version_id MAX)'
    con.query(query, (error, results) => {
        if (error) {
            console.error("Erro na busca dos termos do usuario: ", error);
            return res.status(500).json({ error: 'Database error: ' + error.message });
        }
        res.status(200).json(results);
    });
};


exports.insertAceites = async (req, res) => {
    console.log('Iniciando update');
    
    const {
      info_dispositivo,
      dados_usuario,
      perfis_anuncio_personalizado,
      usar_perfis_anuncios,
      desenvolver_servicos,
    } = req.body;
    
    const id_user = req.params.user_id; // Pegando o ID do usuário da URL
  
    const consentArray = [
      { id_condicao: 1, aceite: info_dispositivo },
      { id_condicao: 2, aceite: dados_usuario },
      { id_condicao: 3, aceite: perfis_anuncio_personalizado },
      { id_condicao: 4, aceite: usar_perfis_anuncios },
      { id_condicao: 5, aceite: desenvolver_servicos },
    ];
  
    // Loop para atualizar cada item individualmente
    for (const consent of consentArray) {
      const query = `
        UPDATE aceites 
        SET aceite = ? 
        WHERE id_user = ? AND id_condicao = ?
      `;
      
      // Executa a query para cada condição
      await new Promise((resolve, reject) => {
        con.query(
          query,
          [consent.aceite, id_user, consent.id_condicao],
          (error, results) => {
            if (error) {
              console.error('Erro ao atualizar os aceites:', error);
              return reject(error);
            }
            resolve(results);
          }
        );
      });
    }
  
    res.status(200).json({ message: 'Consentimentos atualizados com sucesso' });
  };


exports.getUsuarioTermos = async (req, res) => {
    const  {id}  = req.params;
    const query = 'SELECT * FROM usuario_termo WHERE id_user = ? order BY id_termo DESC LIMIT 1;';
    con.query(query, [id], (error, results) => {
        if (error) {
            console.error("Error when getting terms: ", error);
            return res.status(500).json({ error: 'Database error: ' + error.message });
        }
        console.log(id);
        res.status(200).json(results);
    });
};

exports.AcceptLatestTerms = async (req, res) => {
    const { user_id } = req.params;
    const { id_term } = req.body;
    const query = 'UPDATE usuario_termo SET aceito = 1 WHERE id_user = ? AND id_termo = ?';
    con.query(query, [user_id, id_term], (error, results) => {
        if (error) {
            console.error("Error when getting terms: ", error);
            return res.status(500).json({ error: 'Database error: ' + error.message });
        }

        console.log();
        res.status(200).json(results);
    })
};