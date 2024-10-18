import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LoginPage.css';

axios.defaults.withCredentials = true;


const Login: React.FC = () => {
  const [email, setEmailUsuario] = useState('');
  const [senha, setSenhaUsuario] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/term')
      .then(response => {
        localStorage.setItem("terms", JSON.stringify(response.data));
      })
      .catch(error => console.error('Error fetching recent terms', error));
  }, []);

  const redirectToRegister = () => {
    window.location.href = '/register';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/us/login', {
        email,
        senha,
      });

      if (response.status === 200) {
        setMessage('Login successful!');
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
