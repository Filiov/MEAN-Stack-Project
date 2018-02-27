import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { Home } from './components/home/home';
import { Search } from './components/search/search';
import { Register } from './components/register/register';

const appRoutes: Routes = [
    { path: '', component: Home },
    { path: 'search', component: Search },
    { path: 'register', component: Register },
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