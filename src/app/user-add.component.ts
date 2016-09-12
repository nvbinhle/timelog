import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { Router, ActivatedRoute }  from '@angular/router';

import {ProjectService} from './services/project.service';
import {UserService} from './services/user.service';

import {User} from './models/user';
import {Project} from './models/project';

 import {STATUSES_DATA} from './shared/status.data';
 import {ROLES_DATA} from './shared/role.data';
 
@Component({
    selector: 'user-add-tpl',
    styleUrls: []
    , templateUrl: 'app/html/user-add.html'
    , directives: []
    , providers: [ ProjectService]
})

export class UserAddComponent implements OnInit, OnDestroy {
    item: User;
    projects: Project[];
    userGroups: string[] = [];

    statuses: string[] = STATUSES_DATA;
    roles: string[] = ROLES_DATA;

    errorMes: string = '';

    projectCheckeds: string[] = [];
    userGroupCheckeds: string[] = [];

  private   projectSub:  Subscription;
   private  userGrpSub: Subscription;

   isAdd: boolean = true;

    constructor(private userSer: UserService, private prjSer: ProjectService
        , private router: Router, private route: ActivatedRoute) {

        this.item = new User();
        this.item.name = '';
        this.item.password = '';
        this.item.status = this.statuses[0];
        this.item.role = this.roles[0];
    }

    updateChecked(value: string, event: any) {
       // console.log(event);
        if (event.checked) {
            this.projectCheckeds.push(value);
        } else if (!event.checked) {
            let indexx = this.projectCheckeds.indexOf(value);
            this.projectCheckeds.splice(indexx, 1);
        }
    }

    updateUgChecked(value: string, event: any) {
        if (event.checked) {
            this.userGroupCheckeds.push(value);
        }else if (!event.checked) {
            let indexx = this.userGroupCheckeds.indexOf(value);
            this.userGroupCheckeds.splice(indexx, 1);
        }
    }

    getUserGroupUsers() {
        if (this.item.name !== '') {
            this.userSer.getUserGroupUsers(this.item.name)
            .subscribe(res => {
                    this.userGroupCheckeds = [];
                    res.forEach(z => {
                        this.userGroupCheckeds.push(z.key);
                    });
            });
        }
    }

    getUserProjects() {
        if (this.item.name !== '') {
            this.userSer.getUserProjects(this.item.name)
            .subscribe(res => {
                    this.projectCheckeds = [];
                    res.forEach(z => {
                        this.projectCheckeds.push(z.key);
                    });
            });
        }
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

    onChangeStatus(event) {
        // console.log(event)
        if (event.checked) {
            this.item.status = 'on';
        }else {this.item.status = 'off'; }
    }

    onUpdate() {
        if (this.isAdd) {
            // add
            this.userSer.getUser(this.item.name).subscribe(
                res => {
                    if ( res.val() == null) {
                        // validate name
                        this.updateUser();
                        this.router.navigate(['/users']);
                    }
                    else {
                        this.errorMes = this.item.name + ' existed on system';
                    }
                });
        }
        else {
            // update
            this.updateUser();
             this.router.navigate(['/users']);
        }
    }

    private updateUser() {
        // update user
        this.userSer.addItem(this.item);
        // update user project
        this.userSer.addUserProject(this.item.name, this.projectCheckeds);
        // update user group user
        this.userSer.addUserGroupUser(this.item.name, this.userGroupCheckeds);
    }

    ngOnInit() {
         this.route.params.subscribe(params => {
            this.item.name = params['name']; // let id = +params['id']:  (+) converts string 'id' to a number
            this.isAdd = false;
            if (this.item.name != null) {
               this.userSer.getUserObject(this.item.name).subscribe(
                    res => {this.item = res; }
                );
            }
            else {
                this.isAdd = true;
            }
        });

        this.getProjects();
        this.getUserGroups();

        this.getUserProjects();
        this.getUserGroupUsers();
    }

    ngOnDestroy() {
        this.userGrpSub.unsubscribe();
        this.projectSub.unsubscribe();
    }
}
