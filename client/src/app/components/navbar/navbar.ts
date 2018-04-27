import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.html',
    styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
    username;
    email;
    avatar;

    constructor(public authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.authService.getProfile().subscribe(profile => {
            this.username = profile.user.username;
            this.email = profile.user.email;
            this.avatar = profile.user.avatar;
        });
    }


    onLogoutClick() {
        this.authService.logout();
        this.router.navigate(['/']);
    }

}