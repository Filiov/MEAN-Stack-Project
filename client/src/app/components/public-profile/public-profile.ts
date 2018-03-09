import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'public-profile',
    templateUrl: './public-profile.html',
    styleUrls: ['./public-profile.css']
})
export class PublicProfile implements OnInit {

    currnetUrl;
    username;
    email;
    avatar;

    constructor(private authService: AuthService, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.currnetUrl = this.activatedRoute.snapshot.params;
        this.authService.getPublicProfile(this.currnetUrl.username).subscribe(data => {
            this.username = data.user.username;
            this.email = data.user.email;
            this.avatar = data.user.avatar;
        });
    }

}
