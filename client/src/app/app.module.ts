import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RoutingModule } from './routing.module';
import { Navbar } from './components/navbar/navbar';
import { Home } from './components/home/home';
import { Search } from './components/search/search';


@NgModule({
  declarations: [
    AppComponent,
    Navbar,
    Home,
    Search
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
