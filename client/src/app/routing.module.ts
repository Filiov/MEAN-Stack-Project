import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Profile } from './components/profile/profile';

const appRoutes: Routes = [
    { path: '', component: Home },
    { path: 'dashboard', component: Dashboard },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'profile', component: Profile },
    { path: '**', component: Home }
];

@NgModule({
    declarations: [
      
    ],
    imports: [
      RouterModule.forRoot(appRoutes)
    ],
    providers: [],
    bootstrap: [],
    exports: [ RouterModule ]
  })
  export class RoutingModule { }