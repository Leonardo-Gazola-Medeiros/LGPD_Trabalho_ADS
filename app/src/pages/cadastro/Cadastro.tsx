import React, { useState } from 'react';
import axios from 'axios';  // Ensure axios is imported here
import './Cadastro.css';

const Cadastro: React.FC = () => {
  const [nome_usuario, setNomeUsuario] = useState('');
  const [email_usuario, setEmailUsuario] = useState('');
  const [senha_usuario, setSenhaUsuario] = useState('');
  const [message, setMessage] = useState('');

  const redirectToLogin = () => {
    // Redirect to the login page
    window.location.href = '/login';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/us/register/', {
        nome_usuario,
        email_usuario,
        senha_usuario,
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
        <form onSubmit={handleRegister}>
          <div className='form-group'>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={nome_usuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              placeholder="Email"
              value={email_usuario}
              onChange={(e) => setEmailUsuario(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              placeholder="Password"
              value={senha_usuario}
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
    </div>
  );
};

export default Cadastro;
