import { Component, Input, OnInit } from '@angular/core';
import { Router }  from '@angular/router';

import {UserService} from './services/user.service';
import {UserLogin} from './models/user-login';
import {User} from './models/user';

@Component({
   //selector: 'TimeSheets',
    templateUrl: 'app/html/login.html'
    , directives: []
    , styleUrls: []
    , providers: []
})

export class LoginComponent implements OnInit {
    @Input() userLogin: UserLogin;
    // private subcribe: any;
    userName: string;
    public errorMsg = '';

    constructor(private loginSer: UserService, private router: Router) {
        if (this.loginSer.user) {
            this.userName = this.loginSer.user.name;
            if (this.userName) {
                this.router.navigate(['/add-log']);
            }
        }
    }
    onLogin(userName: string, pass: string) {
        let flag = false;
        this.loginSer.login(userName, pass)
            .subscribe(res => {
                this.loginSer.user = new User();
                for (let item of res) {
                    if (item.password === pass && item.status === 'on') {
                        this.loginSer.user.name = item.name;
                        this.loginSer.user.email = item.email;
                        this.loginSer.user.role = item.role;
                        console.log('login:' + this.loginSer.user.role);
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                   // this.router.navigate(['/add-log']);
                    window.location.href = '/add-log';
                } else {
                this.errorMsg = 'Failed to login';
                }
              //  this.subcribe.unsubscribe();
          });
    }
    ngOnInit() {
        //this.loginSer.loginDb();
    }
}
