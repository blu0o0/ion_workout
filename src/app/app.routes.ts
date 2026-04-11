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
  path: 'wsuggestion/:index',
  loadComponent: () => import('./wsuggestion/wsuggestion.page').then(m => m.WsuggestionPage)
}
];
