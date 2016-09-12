import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {MaterializeDirective} from 'angular2-materialize';
import { UserService } from './services/user.service';
import {MenuTop} from './menu-top';
@Component({
  moduleId: module.id,
  selector: 'TimeSheets',
  templateUrl: 'html/app.component.html',
  styleUrls: ['css/app.component.css'],
  directives: [MenuTop, MaterializeDirective] ,
  providers: [ ]

})
export class AppComponent implements OnInit {

  title = 'TimeSheets!';

  userName: string;
  isAdmin = false;

  constructor(private loginSer: UserService, private router: Router) {
    this.userName = this.loginSer.user.name;

        if (this.loginSer.user.role) {
            this.isAdmin = this.loginSer.checkAdminRole(this.loginSer.user.role);
        }
  }

  ngOnInit() {
     this.loginSer.loginDb();
  }
}
