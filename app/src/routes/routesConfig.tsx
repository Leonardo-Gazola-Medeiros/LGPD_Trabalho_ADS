import { RouteProps } from 'react-router-dom';
import Home from '../pages/home/Home';
import LoginPage from '../pages/login/Login';
import Cadastro from '../pages/cadastro/Cadastro';
import UserProfile from '../pages/usuario/telaUsuario';

export interface AppRoute extends RouteProps {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}

const routes: AppRoute[] = [
  {
    path: '/',
    component: Home,
    exact: true,
  },

  {
    path: '/login',
    component: LoginPage,
    exact: true,
  },

  {
    path: '/register',
    component: Cadastro,
    exact: true,
  },
  {
    path: '/user',
    component: UserProfile,
    exact: true,
  },
];

export default routes;