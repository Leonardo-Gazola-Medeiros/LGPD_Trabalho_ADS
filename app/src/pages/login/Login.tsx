import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    // Handle login logic here
    console.log('Username:', username);
    console.log('Password:', password);
  };

  const redirectToRegister = () => {
    // Redirect to the register page
    window.location.href = '/register';
  };

  return (
    <div className="login-wrapper">
    <div className="login-container">
      <h2>Login</h2>
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
      <p>
        Não tem uma conta?{' '}
        <button type="button" onClick={redirectToRegister} className="register-button">
          Cadastre aqui
        </button>
      </p>
    </div>
    </div>
  );
};

export default LoginPage;
