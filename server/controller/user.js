const con = require('../connect/dbconnect');


exports.createUser = async (req, res) => {
  const { username, email, senha } = req.body;

  if (!username || !email || !senha) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    console.log('Inserting new user:', { username, email, senha });  // Add this for debugging

    con.query(
      'INSERT INTO users (username, email, senha) VALUES (?, ?, ?)',
      [username, email, senha],
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
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Both email and password are required' });
  }

  try {
    con.query(
      'SELECT * FROM users WHERE email = ? AND senha = ?',
      [email, senha],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
          const user = results[0];
          //res.cookie('userId', user.id, { httpOnly: true, secure: false });                         <------- CÓDIGO DO LÉO
          //res.cookie('username', user.username, { httpOnly: true, secure: false });

          res
          .cookie("userId", user.id)
          .cookie("username", user.username)
          .status(200)
          .json({ message: "Login successful" });

        } else {
          res.status(401).json({ error: 'Invalid email or password' });
        }
      }
    );
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    console.log('Attempting to delete user with ID:', userId); // Debugging log

    con.query(
      'DELETE FROM users WHERE id = ?',
      [userId],
      (err, results) => {
        if (err) {
          console.error('Error deleting user:', err); // Log specific error
          return res.status(500).json({ error: 'Database error: ' + err.message });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        console.log('User deleted successfully:', results); // Debugging log
        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
      }
    );
  } catch (error) {
    console.error('Error during deletion:', error); // Log specific error
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

