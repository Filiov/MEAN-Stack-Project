import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RoutingModule } from './routing.module';
import { Navbar } from './components/navbar/navbar';
import { Home } from './components/home/home';
import { Search } from './components/search/search';
import { Register } from './components/register/register';
import { AuthService } from './services/auth.service';


@NgModule({
  declarations: [
    AppComponent,
    Navbar,
    Home,
    Search,
    Register
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    RoutingModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
