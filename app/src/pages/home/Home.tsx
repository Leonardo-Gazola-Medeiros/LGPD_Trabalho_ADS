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
    if (userId) {
      fetch(`http://localhost:3000/users/${userId}`, {
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
    </div>
  );
};

export default Home;
