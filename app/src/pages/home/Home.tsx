import React, { useState, useEffect } from 'react';
import './HomePage.css';
import axios from 'axios';
import { Modal, Box, Button, TextField, Checkbox, FormControlLabel,TextareaAutosize,Typography } from '@mui/material';
import { redirect } from 'react-router-dom';

interface Message {
  username: string;
  mensagem: string;
  data: string;
}

interface Condition {
  nome: string;
  obrigatorio: number
  id_condicao: number;
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
  const [ultimoTermoId, setUltimoTermoId] = useState<number | null>(null);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [acceptedConditions, setAcceptedConditions] = useState<{ [key: string]: boolean }>({});
  const [obrigatorias, setObrigatorias] = useState<Condition[]>([]);

  const [termsText, setTermsText] = useState<string>('');
  const [tempTermsText, setTempTermsText] = useState<string>('');  // Valor temporário para os termos
  const [initialTermsText, setInitialTermsText] = useState<string>(''); // Valor inicial para restaurar

  const [openConditionModal, setOpenConditionModal] = useState(false);
  const [conditionName, setConditionName] = useState('');
  const [isRequired, setIsRequired] = useState(false);


  const handleOpenConditionModal = () => setOpenConditionModal(true);
  const handleCloseConditionModal = () => setOpenConditionModal(false);


  useEffect(() => {
    // Initialize all conditions as checked by default
    const initialConditions: { [key: string]: boolean } = {};
    conditions.forEach((cond) => {
      initialConditions[cond.nome] = true; // Set default to checked
    });
    setAcceptedConditions(initialConditions);
  }, [conditions]);

  

  const handleCreateCondition = async () => {
    if (!conditionName.trim()) {
      alert('Please provide a valid condition name.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/term/cond', {
        nome: conditionName,
        obrigatorio: isRequired ? 1 : 0,
      });

      if (response.status === 200) {
        alert('Condition created successfully!');
        setConditionName('');
        setIsRequired(false);
        handleCloseConditionModal();
      } else {
        alert('Failed to create condition.');
      }
    } catch (error) {
      console.error('Error creating condition:', error);
      alert('An error occurred while creating the condition.');
    }
  };

  useEffect(() => {

    const fetchData = async () => {
      if (!document.cookie) {
        redirectLogin();
      }

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

  useEffect(() => {

    const getLatestTermById = async () => {
      try {
        console.log("userId:", userId);
        const response = await axios.get(`http://localhost:3000/term/acc/${userId}`);
        const terms = response.data;
        const latestTerm = terms[0];
        console.log(latestTerm.aceito === 1);
        setUltimoTermoId(latestTerm.id_termo);
        setUltimoTermoAceito(latestTerm.aceito === 1);
        setTermsText(latestTerm.texto);
        setInitialTermsText(latestTerm.texto);
        
      } catch (error) {
        console.error('Error fetching latest term:', error);
      }
    };

    if (userId !== null) {
      getLatestTermById();
    }
  }, [userId]);


  const getCookieValue = (name: string) => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  };

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


  const getConditions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/term/cond');
      setConditions(response.data);
    } catch (error) {
      console.error('Error fetching conditions:', error);
    }
  };

  const getConditionsObrigatorias = async () => {
    try {
      const response = await axios.get('http://localhost:3000/term/obrigatorias');
      setObrigatorias(response.data);
    } catch (error) {
      console.error('Error fetching conditions:', error);
    }
  };

  useEffect(() => {
    getConditionsObrigatorias();
  }, []);



  useEffect(() => {
    getConditions();
  }, []);

  const submitConditions = async () => {
    try {
      const dataToSubmit = conditions.map((cond, index) => ({
        id_condicao: cond.id_condicao, // Assuming condition IDs are sequential
        aceite: !!acceptedConditions[cond.nome],
      }));
  
      const response = await axios.post(
        `http://localhost:3000/term/acc/insert/${userId}`,
        { data: dataToSubmit }
      );
  
      if (response.status === 200) {
        alert('Conditions accepted successfully');
      } else {
        alert('There was an error submitting the conditions');
      }
    } catch (error) {
      console.error('Error submitting conditions:', error);
      alert('An error occurred while sending your responses.');
    }
  };

  const handleCheckboxChange = (conditionName: string) => {
    setAcceptedConditions((prev) => ({
      ...prev,
      [conditionName]: !prev[conditionName],
    }));
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
    console.log(ultimoTermoId)
    const response = await axios.post(`http://localhost:3000/term/acc/${userId}`, {
      id_term: ultimoTermoId,
    });

    console.log(response)
  }
  console.log(ultimoTermoAceito)
  return (
    <div className="home-container">
      <div className="column user-column">
        <h2>{username}</h2>
        <button type="button" onClick={handleDeleteAccount} className="deleteButton">
          Deletar minha conta
        </button>
        {/* <button onClick={retrieveData}>
          recuperar meus dados
        </button> */}
        <button type='button' onClick={handleSettings} className='settings'>
          Settings
        </button>
        <button type='button' onClick={() => window.location.href = '/user'} className='settings'>
          Perfil
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
            <h1>Termos de uso</h1>
            <table
            style={{
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              width: '90%',
              margin: '5%',
            }}
          >
            <tbody>
              {conditions.map((cond, index) => (
                <tr key={index}>
                  <td>{index + 1}. {cond.nome}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={!!acceptedConditions[cond.nome]}
                      onChange={() => handleCheckboxChange(cond.nome)}
                      disabled={cond.obrigatorio === 1} // Lock the checkbox if obrigatorio is 1
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='botoes_footer_modal'>
            <div className='options_modal_footer'>
              <button
                onClick={() => {
                  setOpenSettings(false);
                  setOpenTerms(true);
                  setTempTermsText(tempTermsText);
                }}>Ver Termos</button>
              <button onClick={handleOpenConditionModal}>Criar Condição</button>
              <button onClick={submitConditions}>Salvar e Sair</button>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal open={openConditionModal} onClose={handleCloseConditionModal}>
        <Box
          sx={{
            width: 400,
            margin: 'auto',
            marginTop: '20vh',
            padding: 2,
            backgroundColor: 'white',
            borderRadius: 2,
          }}
        >
          <h2>Criar uma nova condição de uso</h2>
          <TextField
            fullWidth
            label="Condição"
            value={conditionName}
            onChange={(e) => setConditionName(e.target.value)}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
              />
            }
            label="Obrigatória"
          />
          <Box display="flex" justifyContent="space-between" marginTop={2}>
            <Button onClick={handleCloseConditionModal} variant="outlined">
              Cancelar
            </Button>
            <Button onClick={handleCreateCondition} variant="contained" color="primary">
              Criar
            </Button>
          </Box>
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
          open={!ultimoTermoAceito}
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
