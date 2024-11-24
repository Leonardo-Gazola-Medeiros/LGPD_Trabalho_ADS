import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './telaUsuario.css';

interface User {
  id: number;
  username: string;
  email: string;
  genero: string;
  estado: string;
  endereco: string;
  data_nascimento: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: 0,
    username: '',
    email: '',
    genero: '',
    estado: '',
    endereco: '',
    data_nascimento: '',
  });

  const getCookieValue = (name: string) => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  };

  useEffect(() => {
    // Simulação de carregamento de dados do usuário

    const userId = getCookieValue('userId');

    const loadUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/us/${userId}`);
        console.log(response.data);
        setUser(response.data);
        setFormData(response.data); // Preenche o formulário com dados existentes
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.patch(`http://localhost:3000/us/${formData.id}`, formData);
      console.log(response.data);
      setUser(response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="user-profile">
      <h2>Perfil do Usuário</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="user-profile-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>

          {/* <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div> */}

          {/* <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
            />
          </div> */}

          <div className="form-group">
            <label htmlFor="genero">Gênero</label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleInputChange}
            >
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <input
              type="text"
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endereco">Endereço</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="data_nascimento">Data de Nascimento</label>
            <input
              type="date"
              name="data_nascimento"
              value={formData.data_nascimento}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit">Salvar Alterações</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="user-details">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Gênero:</strong> {user.genero}</p>
          <p><strong>Estado:</strong> {user.estado}</p>
          <p><strong>Endereço:</strong> {user.endereco}</p>
          <p><strong>Data de Nascimento:</strong> {user.data_nascimento}</p>

          <button onClick={() => setIsEditing(true)}>Editar Dados</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
