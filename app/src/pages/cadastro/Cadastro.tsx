import React, { useState } from 'react';
import axios from 'axios';  // Ensure axios is imported here
import './Cadastro.css';
import Modal from '@mui/material/Modal';
import { Box, Typography } from '@mui/material';

const Cadastro: React.FC = () => {
  const [username, setNomeUsuario] = useState('');
  const [email, setEmailUsuario] = useState('');
  const [senha, setSenhaUsuario] = useState('');
  const [message, setMessage] = useState('');
  const [openModal,setOpenModal] = useState(false)

  const redirectToLogin = () => {
    // Redirect to the login page
    window.location.href = '/login';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setOpenModal(false)

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
          event.preventDefault()
          setOpenModal(true)
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
          Consentimento de Cookies e Proteção de Dados

Ao se cadastrar em nosso site, você concorda com o uso de cookies e com a nossa Política de Privacidade conforme descrito abaixo.

Cookies

Utilizamos cookies para melhorar sua experiência em nosso site, personalizar conteúdos e anúncios, fornecer funcionalidades de redes sociais e analisar nosso tráfego. Cookies são pequenos arquivos de texto que são armazenados em seu dispositivo quando você visita um site. Eles nos ajudam a lembrar suas preferências e a melhorar a sua navegação.

Você pode optar por não aceitar cookies, ajustando as configurações do seu navegador. No entanto, isso pode afetar a funcionalidade e a experiência geral em nosso site.

Política de Privacidade e LGPD

Estamos comprometidos com a proteção de seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD). Coletamos, usamos e armazenamos suas informações de acordo com nossa Política de Privacidade, que descreve como seus dados são coletados, utilizados, armazenados e compartilhados.

Seus dados pessoais são utilizados exclusivamente para os fins para os quais foram coletados e são protegidos contra acesso não autorizado. Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento. Para mais informações sobre como exercitar seus direitos ou sobre como seus dados são tratados, consulte nossa [Política de Privacidade](link para a política de privacidade).
          </Typography>
          <button onClick={handleRegister}>Eu concordo</button>
          <button className='cancelButton' onClick={redirectToLogin}>Não concordo</button>
        </Box>
        
      </Modal>
    </div>



  );
};

export default Cadastro;
