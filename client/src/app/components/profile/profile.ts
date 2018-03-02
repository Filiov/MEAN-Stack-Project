import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.html',
    styleUrls: ['./profile.css']
})
export class Profile implements OnInit {

    username;
    email;
    avatar;

    constructor(private authService: AuthService ) { }

    ngOnInit() {
        this.authService.getProfile().subscribe(profile => {
            this.username = profile.user.username;
            this.email = profile.user.email;
            this.avatar = profile.user.avatar;
        });
    }

}
