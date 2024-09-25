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
    const query = 'SELECT u.username, m.mensagem, m.data FROM mensagens m JOIN users u ON m.id_user = u.id ORDER BY m.data DESC';
    con.query(query, results => {
      return !results ? res.json([]) : res.json(results)
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};