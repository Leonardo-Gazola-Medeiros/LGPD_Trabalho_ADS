const { con, con_backup } = require('../connect/dbconnect');
const mysql = require('mysql2');

exports.createUser = async (req, res) => {
  const { username, email, senha, genero, estado, endereco, data_nascimento } = req.body;

  if (!username || !email || !senha) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    con.query(
      `INSERT INTO users (username, email, senha, genero, estado, endereco, data_nascimento) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, email, senha, genero, estado, endereco, data_nascimento],
      (err, results) => {
        if (err) {
          console.error('Error inserting user in main DB:', err);
          return res.status(500).json({ error: 'Database error: ' + err.message });
        }

        const insertedUserId = results.insertId;

        // Pega os dados do usuário recém-criado no banco principal
        con.query('SELECT * FROM users WHERE id = ?', [insertedUserId], (err, userData) => {
          if (err) {
            console.error('Error fetching user from main DB:', err);
            return res.status(500).json({ error: 'Error fetching user data: ' + err.message });
          }

          // Insere os dados no banco de backup
          con_backup.query(
            `INSERT INTO users (username, email, senha, genero, estado, endereco, data_nascimento) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userData[0].username, userData[0].email, userData[0].senha, userData[0].genero, userData[0].estado, userData[0].endereco, userData[0].data_nascimento],
            (err) => {
              if (err) {
                console.error('Error inserting user in backup DB:', err);
              }
            }
          );

          res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
        });
      }
    );
  } catch (error) {
    console.error('Error during user creation:', error);
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
    // Verificar se o usuário existe no banco principal
    const [results] = await con.promise().query('SELECT id FROM users WHERE id = ?', [userId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Remover completamente o usuário do banco principal
    await con.promise().query('DELETE FROM users WHERE id = ?', [userId]);

    // Inserir o ID do usuário deletado no banco de backup
    try {
      await con_backup.promise().query('INSERT INTO users (id) VALUES (?)', [userId]);
      res.status(200).json({ message: 'Usuário deletado com sucesso e ID armazenado no backup!' });
    } catch (backupError) {
      console.error('Error inserting into backup database:', backupError);
      res.status(500).json({ error: 'Backup database error: ' + backupError.message });
    }
  } catch (error) {
    console.error('Error during deletion:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};


function addUserDeleteList(email) {
  const deleteDatabaseCon = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "lgpd",
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
          console.error('Error updating user in primary database:', err);
          return res.status(500).json({ error: 'Primary database error: ' + err.message });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'User not found in primary database' });
        }

        // Update user in backup database
        con_backup.query(
          'UPDATE users SET username = ?, genero = ?, estado = ?, endereco = ?, data_nascimento = ? WHERE id = ?',
          [username, genero, estado, endereco, formattedDate, userId],
          (backupErr, backupResults) => {
            if (backupErr) {
              console.error('Error updating user in backup database:', backupErr);
              return res.status(500).json({ error: 'Backup database error: ' + backupErr.message });
            }

            if (backupResults.affectedRows === 0) {
              console.warn('User not found in backup database. Backup might be out of sync.');
              return res.status(200).json({
                message: 'User updated in primary database but not found in backup database',
              });
            }

            res.status(200).json({ message: 'User updated successfully in both databases!' });
          }
        );
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