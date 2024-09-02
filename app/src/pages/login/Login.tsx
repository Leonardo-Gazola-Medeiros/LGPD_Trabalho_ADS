import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';

const Login: React.FC = () => {
  const [email_usuario, setEmailUsuario] = useState('');
  const [senha_usuario, setSenhaUsuario] = useState('');
  const [message, setMessage] = useState('');

  const redirectToRegister = () => {
    // Redirect to the register page
    window.location.href = '/register';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/us/login', {
        email_usuario,
        senha_usuario,
      });

      if (response.status === 200) {
        setMessage('Login successful!');
        // You can also redirect the user to the homepage or save the user session
        window.location.href = '/';
      }
    } catch (error) {
      console.error('There was an error!', error);
      setMessage('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
          {message && <p>{message}</p>}
        </form>
        <p>
          Não tem uma conta?{' '}
          <button type="button" onClick={redirectToRegister} className="register-button">
            Registre-se aqui
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
