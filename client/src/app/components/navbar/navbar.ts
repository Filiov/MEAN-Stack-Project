import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.html',
    styleUrls: ['./navbar.css']
})
export class Navbar {

    constructor(private authService: AuthService, private router: Router) { }

    onLogoutClick(){
        this.authService.logout();
        this.router.navigate(['/']);
    }
                    
}