const con = require('../connect/dbconnect')

// --------- FUNÇÕES DO TERMO ---------- //

exports.InsertTerm = async (req,res) => {
    const {version,texto} = req.body;
    const query = 'INSERT INTO termos (version,texto) VALUES (?,?)'
    con.query(query,[version,texto],(error,results) => {
        if(error){
            console.error("Error inserting term: ", error);
            return res.status(500).json({error:'Database error: ' + error.message})
        }
        res.status(201).json({id:results.insertId})
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
            return res.status(500).json({error: 'Database error: ' + error.message});
        }
        res.status(200).json(results);
    });
};

exports.InsertCondition = async (req, res) => {
    const {version_id,nome,obrigatorio} = req.body;
    const query = 'INSERT INTO condicoes (version_id, nome, obrigatorio) VALUES (?,?,?)'
    con.query(query[version_id,nome,obrigatorio], (error,results) => {
        if(error){
            console.error("Error inserting term: ", error);
            return res.status(500).json({error:'Database error: ' + error.message})
        }
        res.status(201).json({id:results.insertId})
    });
};

// --------- FUNÇÕES DOS ACEITES DO USUARIO --------- //

exports.getAceites = async (req,res) => {
    const query = 'SELECT * FROM condicoes WHERE id_user = ? AND WHERE id_condicao = (WHERE condicoes.version_id MAX)'
    con.query(query, (error, results) => {
        if (error) {
            console.error("Erro na busca dos termos do usuario: ", error);
            return res.status(500).json({error: 'Database error: ' + error.message});
        }
        res.status(200).json(results);
    });
};


exports.insertAceites = async (req, res) => {
    const {id_user, id_condicao, aceite} = req.body;
    const query = 'INSERT INTO condicoes (id_user, id_condicao, aceite) VALUES (?,?,?)'
    con.query(query[id_user, id_condicao, aceite], (error,results) => {
        if(error){
            console.error("Error inserindo os aceites do usuario: ", error);
            return res.status(500).json({error:'Database error: ' + error.message})
        }
        res.status(201).json({id:results.insertId})
    });
};