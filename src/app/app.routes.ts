import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'addnew',
    loadComponent: () => import('./addnew/addnew.page').then( m => m.AddnewPage)
  },
  {
    path: 'selectgoal',
    loadComponent: () => import('./selectgoal/selectgoal.page').then( m => m.SelectgoalPage)
  },
  {
    path: 'wsuggestion',
    loadComponent: () => import('./wsuggestion/wsuggestion.page').then( m => m.WsuggestionPage)
  },
];
