import React, { useState } from 'react';
import './HomePage.css';

interface HomePageProps {
  username: string;
}

interface Message {
  user: string;
  content: string;
}

const Home: React.FC<HomePageProps> = ({ username }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const message = { user: username, content: newMessage };
      setMessages([...messages, message]);
      setNewMessage('');
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
              <strong>{message.user}: </strong> {message.content}
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
