import { Component} from '@angular/core';
import { Router }  from '@angular/router';

import {UserService} from './services/user.service';


@Component({
    selector: 'menu-top',
    styleUrls: [],
    templateUrl: 'app/html/menu-top.html',
    directives: [],
    providers: []
})
export class MenuTop {

    userName: string;
    isAdmin = false;

    constructor(private loginSer: UserService, private router: Router) {
        this.userName = this.loginSer.user.name;

        if (this.loginSer.user.role) {
            this.isAdmin = this.loginSer.checkAdminRole(this.loginSer.user.role);
        }
    }
    logout() {
        this.loginSer.user.name = null;
        this.loginSer.user.email = null;
        this.loginSer.user.role = null;
        this.loginSer.user = null;
        this.router.navigate(['']);
        window.location.href = '/';
    }
}
