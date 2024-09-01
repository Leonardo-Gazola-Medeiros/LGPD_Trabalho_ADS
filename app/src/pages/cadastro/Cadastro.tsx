import React, { useState } from 'react';
import './Cadastro.css';

const Cadastro: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleRegister = () => {
    // Handle registration logic here (e.g., API call)
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Email:', email);
  };

  const redirectToLogin = () => {
    // Redirect to the login page
    window.location.href = '/login';
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h2>Cadastro</h2>
        <form>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={handleRegister}>
            Register
          </button>
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
