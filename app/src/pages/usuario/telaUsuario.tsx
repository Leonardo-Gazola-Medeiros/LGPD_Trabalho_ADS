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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Retorna formato YYYY-MM-DD
  };

  useEffect(() => {
    const userId = getCookieValue('userId');
    const loadUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/us/${userId}`);
        const userData = response.data;
        setUser(userData);
        setFormData({
          ...userData,
          data_nascimento: formatDateForInput(userData.data_nascimento), // Ajusta a data para input
        });
        console.log(userData)
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (response.status === 200) {
        alert('Dados atualizados com sucesso!');
        setUser(response.data);
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  if (!user) return <p>Carregando...</p>;

  return (
    <div className="user-profile">
      <h1>Perfil do Usuário</h1>

      {/* Dados Pessoais */}
      <div className="profile-section">
        <h2>Seus Dados</h2>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Nome de Usuário</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
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
                <option value="N/A"> Prefiro Não Informar</option>
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
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <p><strong>Nome de Usuário:</strong> {user.username}</p>
            <p><strong>E-mail:</strong> {user.email}</p>
            <p><strong>Gênero:</strong> {user.genero}</p>
            <p><strong>Estado:</strong> {user.estado}</p>
            <p><strong>Endereço:</strong> {user.endereco}</p>
            <p><strong>Data de Nascimento:</strong> {formatDate(user.data_nascimento)}</p>
            <button onClick={() => setIsEditing(true)}>Editar</button>
          </div>
        )}
      </div>

      {/* Transparência sobre Uso de Dados */}
      <section className="data-usage">
        <h3>Como usamos seus dados</h3>
        <p>
          Utilizamos seus dados para entender melhor quem usa nossa plataforma, permitindo-nos trazer melhorias no serviço
          e personalizar sua experiência. Por exemplo:
        </p>
        <ul>
          <li>O <strong>nome de usuário</strong> é usado para identificá-lo no sistema.</li>
          <li>O <strong>e-mail</strong> é utilizado para autenticação</li>
          <li>Outros dados, como <strong>endereço</strong>, <strong>Genero</strong>, <strong>data de nascimento</strong> e <strong>estado</strong>, nos ajuda a desenvolver funcionalidades e serviços mais relevantes para sua localização e preferências.</li>
        </ul>
        <p>
          Garantimos que suas informações não serão compartilhadas com terceiros, respeitando sua privacidade e a legislação vigente.
        </p>
        <p>Você pode atualizá-los a qualquer momento.</p>
      </section>
    </div>
  );
};

export default UserProfile;
