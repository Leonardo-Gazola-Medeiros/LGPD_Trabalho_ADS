const con = require('../connect/dbconnect');


exports.createUser = async (req, res) => {
  const { nome_usuario, email_usuario, senha_usuario } = req.body;

  if (!nome_usuario || !email_usuario || !senha_usuario) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    console.log('Inserting new user:', { nome_usuario, email_usuario, senha_usuario });  // Add this for debugging

    con.query(
      'INSERT INTO user (nome_usuario, email_usuario, senha_usuario) VALUES (?, ?, ?)',
      [nome_usuario, email_usuario, senha_usuario],
      (err, results) => {
        if (err) {
          console.error('Error inserting user:', err);  // Log the specific error
          return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        console.log('User inserted successfully:', results);  // Add this for debugging
        res.status(201).json({ message: 'Usuário Cadastrado com Sucesso!' });
      }
    );
  } catch (error) {
    console.error('Error during registration:', error);  // Log the specific error
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};


exports.loginUser = async (req, res) => {
  const { email_usuario, senha_usuario } = req.body;

  if (!email_usuario || !senha_usuario) {
    return res.status(400).json({ error: 'Both email and password are required' });
  }

  try {
    // Query to check if the user exists with the provided email and password
    con.query(
      'SELECT * FROM user WHERE email_usuario = ? AND senha_usuario = ?',
      [email_usuario, senha_usuario],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
          // User found, send success response
          res.status(200).json({ message: 'Login successful', user: results[0] });
        } else {
          // User not found, send unauthorized response
          res.status(401).json({ error: 'Invalid email or password' });
        }
      }
    );
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

