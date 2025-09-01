import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Auth } from './layouts/auth/auth';
import { SignUp } from './pages/auth/sign-up/sign-up';

export const routes: Routes = [
  {
    component: Auth,
    path: 'auth',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'sign-up',
        component: SignUp,
      },
    ],
  },
];
