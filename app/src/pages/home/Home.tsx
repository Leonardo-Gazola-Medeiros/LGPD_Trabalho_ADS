import React, { useState, useEffect } from 'react';
import './HomePage.css';
import axios from 'axios';

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

  useEffect(() => {
    // Verifica se há algum cookie, caso contrário, redireciona para a página de login
    if (!document.cookie) {
      window.location.href = '/login';
    }
  
    // Função para extrair o valor de um cookie específico pelo nome
    const getCookieValue = (name:string) => {
      const cookies = document.cookie.split('; '); // Separa todos os cookies por "; "
      const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`)); // Encontra o cookie pelo nome
  
      if (cookie) {
        return decodeURIComponent(cookie.split('=')[1]); // Retorna o valor do cookie, decodificado
      }
  
      return null;
    };
  
    // Obtém os valores dos cookies 'userId' e 'username'
    const userIdFromCookie = getCookieValue('userId');
    const usernameFromCookie = getCookieValue('username');
  
    if (userIdFromCookie && usernameFromCookie) {
      setUserId(Number(userIdFromCookie)); // Converte o ID do usuário em número e define o estado
      setUsername(usernameFromCookie); // Define o nome do usuário no estado
    } else {
      console.error('User is not logged in');
      window.location.href = '/login'; // Redireciona para a página de login se não encontrar os cookies
    }
  
    // Fetch para obter mensagens do servidor
    fetch('http://localhost:3000/msg')
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error('Error fetching messages:', error));
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' && userId) {
      const messagePayload = {
        userId, // Use userId from the state
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

  const redirectLogin = () => {
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login';
  };
  console.log(username)
  return (
    <div className="home-container">
      <div className="column user-column">
        <h2>{username}</h2>
        <button type='button' onClick={redirectLogin} className='logoutButton'>
          Logout
        </button>
      </div>
      <div className="column message-column">
        <div className="message-area">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <p><strong>{message.username}</strong></p> 
              <p className='chat-text'>{message.mensagem}</p> 
              <span className="timestamp">({new Date(message.data).toLocaleString()})</span>
            </div>
          ))}
        </div>
        <div className="input-area">
          <input className='chat-text'
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
