const con = require('../connect/dbconnect');

exports.sendMessage = async (req, res) => {
  const { userId, mensagem } = req.body;

  if (!userId || !mensagem) {
    return res.status(400).json({ error: 'User ID and message are required' });
  }

  const query = 'INSERT INTO mensagens (id_user, mensagem, data) VALUES (?, ?, NOW())';
  con.query(query, [userId, mensagem], (error, results) => {
    if (error) {
      console.error('Error inserting message:', error);
      return res.status(500).json({ error: 'Database error: ' + error.message });
    }
    res.status(201).json({ id: results.insertId });
  });
};

exports.getMessage = async (req, res) => {
  try {
    const query = 'SELECT u.nome_usuario, m.mensagem, m.data FROM mensagens m JOIN user u ON m.id_user = u.id_user ORDER BY m.data DESC';
    con.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Database error: ' + error.message });
        return;
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};
