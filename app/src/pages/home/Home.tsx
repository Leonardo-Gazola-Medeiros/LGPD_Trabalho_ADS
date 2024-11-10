import React, { useState, useEffect } from 'react';
import './HomePage.css';
import axios from 'axios';
import { Button, Modal, TextareaAutosize } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { redirect } from 'react-router-dom';

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
  const [ultimoTermoAceito, setUltimoTermoAceito] = useState<boolean>(true);
  const [openTerms, setOpenTerms] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [termsText, setTermsText] = useState<string>('');
  const [tempTermsText, setTempTermsText] = useState<string>('');  // Valor temporário para os termos
  const [initialTermsText, setInitialTermsText] = useState<string>(''); // Valor inicial para restaurar

  useEffect(() => {
    const fetchData = async () => {
      if (!document.cookie) {
        redirectLogin();
      }

      const getLatestTermById = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/term/acc/${userId}`);
          const terms = response.data;
          const latestTerm = terms[0];
          setUltimoTermoAceito(latestTerm.aceito === 1);
          setTermsText(latestTerm.texto);
          setInitialTermsText(latestTerm.texto);
        } catch (error) {
          console.error('Error fetching latest term:', error);
        }
      };

      const getCookieValue = (name: string) => {
        const cookies = document.cookie.split('; ');
        const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
      };

      await getLatestTermById();
      const userIdFromCookie = getCookieValue('userId');
      const usernameFromCookie = getCookieValue('username');

      if (userIdFromCookie && usernameFromCookie) {
        setUserId(Number(userIdFromCookie));
        setUsername(usernameFromCookie);
      } else {
        console.error('User is not logged in');
        redirectLogin();
      }

      try {
        const response = await fetch('http://localhost:3000/msg');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }

      const termsFromLocalStorage = localStorage.getItem("terms");
      if (termsFromLocalStorage) {
        const parsedTerms = JSON.parse(termsFromLocalStorage);
        setTermsText(parsedTerms[0].texto);
        setInitialTermsText(parsedTerms[0].texto);
      }
    };

    fetchData();
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
    if (!window.confirm("Tem certeza que deseja alterar os termos de uso?")) {
      setOpenTermsUpdate(false);
      setOpenSettings(true);
      return;
    }



    const updatedTerms = { texto: tempTermsText };
    localStorage.setItem("terms", JSON.stringify([updatedTerms]));

    fetch('http://localhost:3000/term', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTerms),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        alert("Termos atualizados com sucesso!");
        setTermsText(tempTermsText);
        setOpenTermsUpdate(false);
        setOpenSettings(true);
      })
      .catch(error => console.error('Erro ao atualizar termos:', error));
  };

  const handleSettings = () => {
    setOpenSettings(true);
  };

  const redirectLogin = () => {
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login';
  };


  const handleRejectAll = () => {
    // Desmarca todas as checkboxes
    const checkboxes = document.querySelectorAll('.check_consent');
    checkboxes.forEach((checkbox) => checkbox.checked = false);

    // Prepara os dados para enviar
    const consentData = {
      info_dispositivo: false,
      dados_usuario: false,
      perfis_anuncio_personalizado: false,
      usar_perfis_anuncios: false,
      desenvolver_servicos: false
    };

    // Faz a requisição para o servidor
    fetch('http://localhost:3000/acc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consentData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        alert("Todas as opções foram rejeitadas.");
        setOpenSettings(false); // Fecha o modal
      })
      .catch(error => console.error('Erro ao enviar consentimento:', error));
  };

  const handleSaveAndExit = () => {
    // Pega o status de todas as checkboxes
    const consentData = {
      info_dispositivo: document.querySelector('input[name="info_dispositivo"]'),
      dados_usuario: document.querySelector('input[name="dados_usuario"]'),
      perfis_anuncio_personalizado: document.querySelector('input[name="perfis_anuncio_personalizado"]'),
      usar_perfis_anuncios: document.querySelector('input[name="usar_perfis_anuncios"]'),
      desenvolver_servicos: document.querySelector('input[name="desenvolver_servicos"]'),
    };

    // Faz a requisição para o servidor com os dados selecionados
    fetch('http://localhost:3000/acc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consentData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        alert("Consentimento salvo com sucesso.");
        setOpenSettings(false); // Fecha o modal
      })
      .catch(error => console.error('Erro ao enviar consentimento:', error));
  };
  const retrieveData = () => {
    // Cria um objeto com os dados do usuário e as mensagens
    const dataToDownload = {
      user: {
        id: userId,
        username: username,
      },
      messages: messages,
    };

    const dataStr = JSON.stringify(dataToDownload, null, 2); // Formata as informações em JSON
    const blob = new Blob([dataStr], { type: 'application/json' }); // Cria um blob com o conteúdo
    const url = URL.createObjectURL(blob); // Cria uma URL para o blob

    const a = document.createElement('a'); // Cria um link
    a.href = url; // Define a URL do link
    a.download = 'dados_usuario_e_historico.json'; // Define o nome do arquivo para download
    document.body.appendChild(a); // Adiciona o link ao corpo
    a.click(); // Simula o clique no link
    document.body.removeChild(a); // Remove o link após o download
    URL.revokeObjectURL(url); // Libera a URL do blob
  };


  async function handleLastTermAccept() {

    const ultimoTermo = JSON.parse(localStorage.getItem("terms") || "[]")[0];

    const response = await axios.post(`http://localhost:3000/terms/acc/${userId}`, {
      id_user: userId,
      id_term: ultimoTermo.version
    })

    console.log(response)
  }


  return (
    <div className="home-container">
      <div className="column user-column">
        <h2>{username}</h2>
        <button type="button" onClick={handleDeleteAccount} className="deleteButton">
          Deletar minha conta
        </button>
        <button onClick={retrieveData}>
          recuperar meus dados
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
          <div className='modal_title'>
            <h1>Configurações</h1>
          </div>
          <div className='top_modal_box'>
            <h4 id="modal-label" style={{ margin: 0 }}>Consentimento de uso</h4>
            <button className='att_termos'
              onClick={() => {
                setOpenSettings(false);
                setTempTermsText(termsText); // Define o texto temporário ao abrir o modal
                setOpenTermsUpdate(true);
              }}
            >
              Atualizar termos
            </button>
          </div>
          <p className='modal_terms_text'>
            Você concorda com o uso de nossa parte dos seguintes dados
          </p>
          <div className='divisor'></div>
          <div>
            <div className='opcoes_consent'>
              <div className='texto_consent'>Armazenar informações do dispositivo</div>
              <input className='check_consent' id='desenvolver_servicos' type="checkbox" role='switch' name="info_dispositivo" />
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
              <input className='check_consent' id='desenvolver_servicos' type="checkbox" role='switch' name="info_dispositivo" />
            </div>
          </div>
          <div className='botoes_footer_modal'>
            <div className='options_modal_footer'>
              <button
                onClick={() => {
                  setOpenSettings(false);
                  setOpenTerms(true);
                  setTempTermsText(tempTermsText);
                }}>Ver Termos</button>
              <button onClick={handleRejectAll}>Rejeitar Tudo</button>
              <button onClick={handleSaveAndExit}>Salvar e Sair</button>
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
            value={tempTermsText}  // O valor do textarea agora é o estado temporário
            onChange={(e) => setTempTermsText(e.target.value)}  // Atualiza o estado temporário
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
                setTempTermsText(initialTermsText); // Restaura o valor original se não salvar
              }}
            >
              Fechar
            </Button>
          </div>
        </Box>
      </Modal >

      <Modal
        className='modal_container'
        open={openTerms}
        onClose={() => setOpenTerms(false)}
        aria-labelledby="update-terms-title"
        aria-describedby="update-terms-description"
      >
        <Box className="modalBox" style={{ width: '600px', padding: '20px' }}>
          <div className='modal_title'>
            <h1>Termos</h1>
          </div>
          <Typography style={{ textAlign: 'justify' }}>
            {tempTermsText}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setOpenTerms(false);
              setOpenSettings(true);
              setTempTermsText(tempTermsText);
            }}
          >
            Fechar
          </Button>
        </Box>
      </Modal>

      {ultimoTermoAceito == false && (

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
            <button onClick={handleLastTermAccept}>Eu concordo</button>
            <button className='cancelButton' onClick={redirectLogin}>Não concordo</button>
          </Box>
        </Modal>
      )}

    </div>
  );
};

export default Home;
