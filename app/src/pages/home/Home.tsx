import React, { useState, useEffect } from 'react';
import './HomePage.css';
import axios from 'axios';

interface Message {
  nome_usuario: string;
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
    const getCookieValue = () => {
      const cookieSplitado = document.cookie.split("=")
      let iddousuario = cookieSplitado[1]
      iddousuario.split(';')
      iddousuario = iddousuario[0]
      const nomedosusuario = cookieSplitado[2]

      return [iddousuario, nomedosusuario] 
    };

    const [ userIdFromCookie, usernameFromCookie ] = getCookieValue();

    if (userIdFromCookie && usernameFromCookie) {
      setUserId(Number(userIdFromCookie));
      setUsername(usernameFromCookie);
    } else {
      console.error('User is not logged in');
    }

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
    window.location.href = '/login';
  };

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
              <strong>{message.nome_usuario}:</strong> {message.mensagem} <span className="timestamp">({new Date(message.data).toLocaleString()})</span>
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
