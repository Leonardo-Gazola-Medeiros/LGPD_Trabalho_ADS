import React, { useState, useEffect } from 'react';
import './HomePage.css';

interface HomePageProps {
  username: string;
  userId: number; // Add userId prop to identify the user
}

interface Message {
  nome_usuario: string;
  mensagem: string;
  data: string;
}

const Home: React.FC<HomePageProps> = ({ username, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    // Fetch messages from backend
    fetch('http://localhost:3000/msg')
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error('Error fetching messages:', error));
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const message = { userId, message: newMessage };
      
      fetch('http://localhost:3000/msg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      })
      .then(response => response.json())
      .then(() => {
        // Refresh messages after sending
        return fetch('/msg/');
      })
      .then(response => response.json())
      .then(data => {
        setMessages(data);
        setNewMessage('');
      })
      .catch(error => console.error('Error sending message:', error));
    }
  };

  const redirectLogin = () => {
    // Redirect to the register page
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
