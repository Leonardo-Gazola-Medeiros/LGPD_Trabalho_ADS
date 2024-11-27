import React, { useState } from 'react';
import axios from 'axios';
import './Cadastro.css';
import Modal from '@mui/material/Modal';
import { Box, Typography } from '@mui/material';

const Cadastro: React.FC = () => {
  const [username, setNomeUsuario] = useState('');
  const [email, setEmailUsuario] = useState('');
  const [senha, setSenhaUsuario] = useState('');
  const [genero, setGenero] = useState('Outro');
  const [estado, setEstado] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [message, setMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const redirectToLogin = () => {
    window.location.href = '/login';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setOpenModal(false);


    const ultimoTermo = JSON.parse(localStorage.getItem("terms") || "[]")[0]
    console.log(ultimoTermo)


    try {
      const response = await axios.post('http://localhost:3000/us/register/', {
        username,
        email,
        senha,
        genero,
        estado,
        endereco,
        data_nascimento: dataNascimento, // Backend espera este formato
      });


      const AcceptResponse = await axios.post(`http://localhost:3000/term/acc/${response.data.newUser.id}`, {
        id_term: ultimoTermo.version,
      });

      console.log("response accept",AcceptResponse)
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
          <div className='form-group'>
            <label htmlFor="genero">Gênero</label>
            <select
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              required
            >
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor="estado">Estado</label>
            <input
              type="text"
              placeholder="Estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor="endereco">Endereço</label>
            <input
              type="text"
              placeholder="Endereço"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor="dataNascimento">Data de Nascimento</label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
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
            {JSON.parse(localStorage.getItem("terms") || "[]")[0]?.texto}
          </Typography>
          <button onClick={handleRegister}>Eu concordo</button>
          <button className='cancelButton' onClick={redirectToLogin}>Não concordo</button>
        </Box>
      </Modal>
    </div>
  );
};

export default Cadastro;
