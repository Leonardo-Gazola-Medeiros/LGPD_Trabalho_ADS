const con = require('../connect/dbconnect');
const mysql = require('mysql2');

exports.createUser = async (req, res) => {
  console.log(`Requisição recebida com os dados: ${JSON.stringify(req.body)}`);
  const { username, email, senha, genero, estado, endereco, data_nascimento } = req.body;

  if (!username || !email || !senha) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    console.log('Inserting new user:', { username, email, senha, genero, estado, endereco, data_nascimento });

    con.query(
      `INSERT INTO users (username, email, senha, genero, estado, endereco, data_nascimento) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, email, senha, genero, estado, endereco, data_nascimento],
      (err, results) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        console.log('User inserted successfully:', results);
        res.status(201).json({ message: 'Usuário Cadastrado com Sucesso!' });
      }
    );
  } catch (error) {
    console.error('Error during registration:', error);
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
          res
            .cookie("userId", user.id)
            .cookie("username", user.username)
            .status(200)
            .send({ message: "Login successful" });
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
    const [results] = await con.promise().query('SELECT email FROM users WHERE id = ?', [userId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { email } = results[0];
    addUserDeleteList(email);

    con.query(
      'DELETE FROM users WHERE id = ?',
      [userId],
      (err, results) => {
        if (err) {
          console.error('Error deleting user:', err);
          return res.status(500).json({ error: 'Database error: ' + err.message });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
      }
    );
  } catch (error) {
    console.error('Error during deletion:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

function addUserDeleteList(email) {
  const deleteDatabaseCon = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "131313",
    database: "lgpd_removed_users"
  });

  deleteDatabaseCon.connect((err) => {
    if (err) {
      console.error('Erro ao conectar:', err);
      return;
    }
    console.log('Conexão bem sucedida');
  });

  deleteDatabaseCon.query("INSERT INTO users (email) VALUES (?)", [email], (err, result) => {
    if (err) {
      console.error('Erro ao inserir email no banco:', err);
    } else {
      console.log('Email inserido no banco com sucesso:', result);
    }
  });

}

function updateUser(req, res) {
  const { userId } = req.params;
  const { username, email, senha, genero, estado, endereco, data_nascimento } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Converte a data para o formato correto
  const formattedDate = new Date(data_nascimento).toISOString().split('T')[0]; 

  try {
    con.query(
      'UPDATE users SET username = ?, genero = ?, estado = ?, endereco = ?, data_nascimento = ? WHERE id = ?',
      [username, genero, estado, endereco, formattedDate, userId],
      (err, results) => {
        if (err) {
          console.error('Error updating user:', err);
          return res.status(500).json({ error: 'Database error: ' + err.message });
        }

        if (results.affectedRows === 0) {

          return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
      }
    );
  } catch (error) {
    console.error('Error during update:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}



function getUserById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    con.query(
      'SELECT * FROM users WHERE id = ?',
      [id],
      (err, results) => {
        if (err) {
          console.error('Error getting user:', err);
          return res.status(500).json({ error: 'Database error: ' + err.message });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(results[0]);
      }
    );
  }
  catch (error) {
    console.error('Error during deletion:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}

exports.getUserById = getUserById
exports.updateUser = updateUser