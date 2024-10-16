import React, { useState, useEffect } from 'react';
import './HomePage.css';
import axios from 'axios';
import { Button, Modal, TextareaAutosize } from '@mui/material';
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
  const [openTermsUpdate, setOpenTermsUpdate] = useState(false);
  const [termsText, setTermsText] = useState<string>('');

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
    if (!window.confirm("Tem certeza que deseja deletar a sua conta?")) return;
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

  const handleSaveTerms = () => {
    console.log("Termos salvos: ", termsText);
    setOpenTermsUpdate(false);
    setOpenSettings(true);
  };

  const handleSettings = () => {
    setOpenSettings(true);
  };

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 id="modal-label" style={{ margin: 0 }}>Consentimento de uso</h4>
            <button
              style={{ marginLeft: '150px' }}
              onClick={() => {
                setOpenSettings(false);
                setOpenTermsUpdate(true);
              }}
            >
              Atualizar termos
            </button>
          </div>
          <p>
            Você concorda com o uso de nossa parte dos seguintes dados
          </p>
          <div className='divisor'></div>
          <div>
            <div className='opcoes_consent'>
              <div className='texto_consent'>Armazenar informações do dispositivo</div>
              <input className='check_consent' type="checkbox" role='switch' name="info_dispositivo" />
            </div>
            <div className='opcoes_consent'>
              <div className='texto_consent'>Uso dos dados do usuário</div>
              <input className='check_consent' type="checkbox" role='switch' name="info_dispositivo" />
            </div>
            <div className='opcoes_consent'>
              <div className='texto_consent'>Criar perfis de anuncio personalizado</div>
              <input className='check_consent' type="checkbox" role='switch' name="info_dispositivo" />
            </div>
            <div className='opcoes_consent'>
              <div className='texto_consent'>Usar perfis para anuncios personalizados</div>
              <input className='check_consent' type="checkbox" role='switch' name="info_dispositivo" />
            </div>
            <div className='opcoes_consent'>
              <div className='texto_consent'>Desenvolver e aprimorar serviços</div>
              <input className='check_consent' type="checkbox" role='switch' name="info_dispositivo" />
            </div>
          </div>
          <div className='botoes_footer_modal'>
            <div className='options_modal_footer'>
              <button>Ver Termos</button>
              <button>Rejeitar Tudo</button>
              <button>Salvar e Sair</button>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal
        className='modal_container'
        open={openTermsUpdate}
        onClose={() => setOpenTermsUpdate(false)}
        aria-labelledby="update-terms-title"
        aria-describedby="update-terms-description"
      >
        <Box className="modalBox" style={{ width: '600px', padding: '20px' }}>
          <Typography id="update-terms-title" variant="h5" component="h2" gutterBottom>
            Atualizar Termos de Condições
          </Typography>
          <TextareaAutosize
            aria-label="empty textarea"
            minRows={15}
            placeholder="Escreva aqui os novos termos..."
            style={{ width: '98%', padding: '10px', fontSize: '16px' }}
            value={termsText}
            onChange={(e) => setTermsText(e.target.value)}
          />
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="primary" onClick={handleSaveTerms}>
              Salvar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setOpenTermsUpdate(false);
                setOpenSettings(true);
              }}
            >
              Fechar
            </Button>
          </div>
        </Box>
      </Modal>    

    </div>
  );
};

export default Home;
