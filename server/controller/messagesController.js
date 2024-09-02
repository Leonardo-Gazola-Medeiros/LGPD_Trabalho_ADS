const con = require('../connect/dbconnect');


exports.sendMessage = async (req, res) => {

    const { userId, message } = req.body;
  const query = 'INSERT INTO mensagens (id_user, mensagem, data) VALUES (?, ?, NOW())';
  connection.query(query, [userId, message], (error, results) => {
    if (error) throw error;
    res.status(201).json({ id: results.insertId });
  });
};

exports.getMessage = async (req, res) => {
    connection.query('SELECT u.nome_usuario, m.mensagem, m.data FROM mensagens m JOIN user u ON m.id_user = u.id_user ORDER BY m.data DESC', (error, results) => {
        if (error) throw error;
        res.json(results);
      });
}