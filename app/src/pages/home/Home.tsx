import React, { useState, useEffect } from 'react';
import './HomePage.css';
import axios from 'axios';
import { Modal } from '@mui/material';
import { Box, Typography } from '@mui/material';

interface Message {
  username: string;
  mensagem: string;
  data: string;
}

axios.defaults.withCredentials = true;

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<number | null>(null);
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    if (!document.cookie) {
      window.location.href = '/login';
    }

    const getCookieValue = (name: string) => {
      const cookies = document.cookie.split('; ');
      const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));

      if (cookie) {
        return decodeURIComponent(cookie.split('=')[1]);
      }

      return null;
    };

    const userIdFromCookie = getCookieValue('userId');
    const usernameFromCookie = getCookieValue('username');

    if (userIdFromCookie && usernameFromCookie) {
      setUserId(Number(userIdFromCookie));
      setUsername(usernameFromCookie);
    } else {
      console.error('User is not logged in');
      window.location.href = '/login';
    }

    fetch('http://localhost:3000/msg')
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error('Error fetching messages:', error));
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' && userId) {
      const messagePayload = {
        userId,
        mensagem: newMessage,
      };

      fetch('http://localhost:3000/msg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(() => {
          return fetch('http://localhost:3000/msg');
        })
        .then(response => response.json())
        .then(data => {
          setMessages(data);
          setNewMessage('');
        })
        .catch(error => console.error('Error sending message:', error));
    } else {
      console.error('User is not logged in or message is empty');
    }
  };

  const handleDeleteAccount = () => {
    if (!window.confirm("Tem certeza que deseja deletar a sua conta?")) return
    if (userId) {
      fetch(`http://localhost:3000/us/${userId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          alert('Conta deletada com sucesso!');
          redirectLogin();
        })
        .catch(error => console.error('Erro ao deletar conta:', error));
    }
  };

  const handleSettings = () => {
    setOpenSettings(true);
  }

  const redirectLogin = () => {
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login';
  };

  return (
    <div className="home-container">
      <div className="column user-column">
        <h2>{username}</h2>
        <button type="button" onClick={handleDeleteAccount} className="deleteButton">
          Deletar minha conta
        </button>
        <button type='button' onClick={handleSettings} className='settings'>
          Settings
        </button>
        <button type="button" onClick={redirectLogin} className="logoutButton">
          Logout
        </button>
      </div>
      <div className="column message-column">
        <div className="message-area">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <p><strong>{message.username}</strong></p>
              <p className="chat-text">{message.mensagem}</p>
              <span className="timestamp">({new Date(message.data).toLocaleString()})</span>
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            className="chat-text"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      <Modal
        className='modal_container'
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modalBox">
          <Typography id="modal-title" variant="h4" component="h2">
            Settings
          </Typography>
        <div>
          <h4 id="modal-label">Consetimento de uso</h4>
          <p>
            Você concorda com o uso de nossa parte dos seguintes dados
          </p>
        </div>
        <div className='divisor'></div>

        <div>
          <div className='opcoes_consent'>
            <div className='texto_consent'>Armazenar informações do dispositivo</div><input className='check_consent' type="checkbox" role='switch' name="info_dispositivo" id="" />
          </div>
          <div className='opcoes_consent'>
            <div className='texto_consent'>Uso dos dados do usuário</div><input className='check_consent' type="checkbox" role='switch' name="info_dispositivo" id="" />          </div>
          <div className='opcoes_consent'>
            <div className='texto_consent'>Criar perfis de anuncio personalizado</div><input className='check_consent' type="checkbox" role='switch' name="info_dispositivo" id="" />          </div>
          <div className='opcoes_consent'>
            <div className='texto_consent'>Usar perfis para anuncios personalizados</div><input className='check_consent' type="checkbox" role='switch' name="info_dispositivo" id="" />          </div>
          <div className='opcoes_consent'>
            <div className='texto_consent'>Desenvolver e aprimorar serviços</div><input className='check_consent' type="checkbox" role='switch' name="info_dispositivo" id="" />          </div>
        </div>

        <div className='botoes_footer_modal'>
            <div className='options_modal_footer'>
              <button> ver termos</button>
              <button> rejeitar tudo</button>
              <button> salvar e sair</button>
            </div>
        </div>

        </Box>

      </Modal>
    </div>


  );
};

export default Home;
