import React, { useState } from 'react';
import axios from 'axios';
import './Cadastro.css';
import Modal from '@mui/material/Modal';
import { Box, Typography } from '@mui/material';

interface Term {
  version: number;
  texto: string;
}

const Cadastro: React.FC = () => {
  const [username, setNomeUsuario] = useState('');
  const [email, setEmailUsuario] = useState('');
  const [senha, setSenhaUsuario] = useState('');
  const [message, setMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);  

  const redirectToLogin = () => {
    window.location.href = '/login';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setOpenModal(false);

    try {
      const response = await axios.post('http://localhost:3000/us/register/', {
        username,
        email,
        senha,
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error('There was an error!', error);
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className='register-wrapper'>
      <div className="register-container">
        <h2>Cadastro</h2>
        <form onSubmit={(event) => {
          event.preventDefault();
          setOpenModal(true);
        }}>
          <div className='form-group'>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setNomeUsuario(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmailUsuario(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              placeholder="Password"
              value={senha}
              onChange={(e) => setSenhaUsuario(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register</button>
          {message && <p>{message}</p>}
        </form>
        <p>
          Já tem uma conta?{' '}
          <button type="button" onClick={redirectToLogin} className="login-button">
            Entre aqui
          </button>
        </p>
      </div>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='modalBox'>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Termo de consentimento
          </Typography>
          <Typography id="modal-modal-description" sx={{ my: 4 }}>
            {JSON.parse(localStorage.getItem("terms") || "[]")[0].texto}
          </Typography>
          <button onClick={handleRegister}>Eu concordo</button>
          <button className='cancelButton' onClick={redirectToLogin}>Não concordo</button>
        </Box>
      </Modal>
    </div>
  );
};

export default Cadastro;
