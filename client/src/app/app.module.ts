import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RoutingModule } from './routing.module';
import { Navbar } from './components/navbar/navbar';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { AuthService } from './services/auth.service';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Profile } from './components/profile/profile';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';


@NgModule({
  declarations: [
    AppComponent,
    Navbar,
    Home,
    Dashboard,
    Register,
    Login,
    Profile
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    RoutingModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    NotAuthGuard
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
