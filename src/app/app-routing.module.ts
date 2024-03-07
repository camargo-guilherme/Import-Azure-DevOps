import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LayoutPagesComponent } from './shared/components/layout-pages/layout-pages.component';
import { LoginComponent } from './pages/login/login.component';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutPagesComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
    ]
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {
      useHash: false,
      onSameUrlNavigation: 'reload',
      enableTracing: !environment.production,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
