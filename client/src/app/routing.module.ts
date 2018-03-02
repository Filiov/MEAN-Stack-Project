import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { Profile } from './components/profile/profile';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { Memento } from './components/memento/memento';
import { EditMemento } from './components/memento/edit-memento/edit-memento';


const appRoutes: Routes = [
    { path: '', component: Home },
    { path: 'register', component: Register, canActivate: [NotAuthGuard] },
    { path: 'login', component: Login, canActivate: [NotAuthGuard] },
    { path: 'profile', component: Profile, canActivate: [AuthGuard] },
    { path: 'memento', component: Memento, canActivate: [AuthGuard] },
    { path: 'edit-memento/:id', component: EditMemento, canActivate: [AuthGuard] },
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