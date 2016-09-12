import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import {ProjectService} from './services/project.service';
import {UserService} from './services/user.service';

import {User} from './models/user';
import {Project} from './models/project';

@Component({
    selector: 'user-tpl',
    styleUrls: []
    , templateUrl: 'app/html/user.html'
    , directives: []
    , providers: [ ProjectService]
})

export class UserComponent implements OnInit, OnDestroy {
    items: User[];

    projects: Project[];
    userGroups: string[] = [];

   private  userSub: Subscription;
    private   projectSub:  Subscription;
   private  userGrpSub: Subscription;

    constructor(private userSer: UserService, private prjSer: ProjectService) {
    }

    getAll() {
        this.userSub = this.userSer.getUsers().subscribe(res => {
            this.items = res;
        });
    }

    ngOnInit() {
        this.getAll();
        this.getProjects();
        this.getUserGroups();
    }

    getUserGroups() {
        this.userGrpSub = this.userSer.getUserGroups().subscribe(res => {
            if (res.length > 0) {
                res.forEach(z => {
                    if ( this.userGroups.indexOf(z.key) === -1)
                        {this.userGroups.push(z.key); }
                });
            }
        });
    }

    getProjects() {
        this.projectSub = this.prjSer.getItems().subscribe(res => {
            this.projects = res;
        });
    }
    ngOnDestroy() {
         this.userGrpSub.unsubscribe();
        this.projectSub.unsubscribe();
        this.userSub.unsubscribe();
    }
}
