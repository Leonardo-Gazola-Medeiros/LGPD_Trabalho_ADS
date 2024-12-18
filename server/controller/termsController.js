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

exports.getAllOptionalConditions = async (req, res) => {
    const query = 'SELECT * FROM condicoes';
    con.query(query, (error, results) => {
        if (error) {
            console.error("Erro na busca das condições: ", error);
            return res.status(500).json({ error: 'Database error: ' + error.message });
        }
        res.status(200).json(results);
    });
};

exports.getConditionsObrigatorias = async (req, res) => {
    const query = 'SELECT * FROM condicoes WHERE obrigatorio = 1';
    con.query(query, (error, results) => {
        if (error) {
            console.error("Erro na busca das condições: ", error);
            return res.status(500).json({ error: 'Database error: ' + error.message });
        }
        res.status(200).json(results);
    });
};


exports.InsertCondition = async (req, res) => {
    const { nome, obrigatorio } = req.body;
  
    if (!nome) {
      return res.status(400).json({ error: 'Condition name is required.' });
    }
  
    const query = 'INSERT INTO condicoes (nome, obrigatorio) VALUES (?, ?)';
    con.query(query, [nome, obrigatorio], (error, results) => {
      if (error) {
        console.error('Error inserting condition:', error);
        return res.status(500).json({ error: 'Database error: ' + error.message });
      }
  
      res.status(200).json({ message: 'Condition inserted successfully.', id: results.insertId });
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
    const userId = req.params.user_id; // Retrieve the user ID from the URL
    const conditions = req.body.data; // Array of { id_condicao, aceite }
    
    if (!userId || !Array.isArray(conditions)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
  
    const insertAceitesQuery = `
      INSERT INTO aceites (id_user, id_condicao, aceite)
      VALUES (?, ?, ?);
    `;
  
    const updateUltimosAceitesQuery = `
        UPDATE ultimos_aceites 
        SET aceite = ?, data_alterada = NOW()
        WHERE id_user = ? AND id_condicao = ?;
    `;
  
    try {
      const promises = conditions.map(({ id_condicao, aceite }) => {
        // Insert into `aceites`
        const aceitesPromise = new Promise((resolve, reject) => {
          con.query(
            insertAceitesQuery,
            [userId, id_condicao, aceite],
            (error, results) => {
              if (error) reject(error);
              else resolve(results);
            }
          );
        });
  
        // Update `ultimos_aceites`
        const ultimosAceitesPromise = new Promise((resolve, reject) => {
          con.query(
            updateUltimosAceitesQuery,
            [aceite, userId, id_condicao],
            (error, results) => {
              if (error) reject(error);
              else resolve(results);
            }
          );
        });
  
        return Promise.all([aceitesPromise, ultimosAceitesPromise]);
      });
  
      await Promise.all(promises);
  
      res.status(200).json({ message: 'Conditions updated successfully in both tables.' });
    } catch (error) {
      console.error('Error updating conditions:', error);
      res.status(500).json({ error: 'Database error: ' + error.message });
    }
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