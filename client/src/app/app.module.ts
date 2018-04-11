import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RoutingModule } from './routing.module';
import { Navbar } from './components/navbar/navbar';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { AuthService } from './services/auth.service';
import { Login } from './components/login/login';
import { Profile } from './components/profile/profile';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { Memento } from './components/memento/memento';
import { MementoService } from './services/memento.service';
import { Footer } from './components/footer/footer';
import { EditMemento } from './components/memento/edit-memento/edit-memento';
import { DeleteMemento } from './components/memento/delete-memento/delete-memento';
import { PublicProfile } from './components/public-profile/public-profile';
import { Search } from './components/search/search';


@NgModule({
    declarations: [
        AppComponent,
        Navbar,
        Home,
        Register,
        Login,
        Profile,
        Memento,
        Footer,
        DeleteMemento,
        EditMemento,
        PublicProfile,
        Search
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        RoutingModule
    ],
    providers: [
        AuthService,
        MementoService,
        AuthGuard,
        NotAuthGuard
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
