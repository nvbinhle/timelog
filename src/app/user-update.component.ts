import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import {ProjectService} from './services/project.service';
import {UserService} from './services/user.service';

import {User} from './models/user';
import {Project} from './models/project';

 import {STATUSES_DATA} from './shared/status.data';
 import {ROLES_DATA} from './shared/role.data';

@Component({
    selector: 'user-update-tpl',
    styleUrls: []
    , templateUrl: 'app/html/user-update.html'
    , directives: []
    , providers: [ ProjectService]
})

export class UserUpdateComponent implements OnDestroy {

    @Input() item: User;
    @Input() projects: Project[];
    @Input() userGroups: string[] = [];

    statuses: string[] = STATUSES_DATA;
    roles: string[] = ROLES_DATA;

    projectCheckeds: string[] = [];
    userGroupCheckeds: string[] = [];

   private  userProjSub: Subscription;
   private  userGrpUserSub: Subscription;

    isShowUpdate: boolean = false;
    flagAdd : boolean = false;

    constructor(private userSer: UserService, private prjSer: ProjectService) {

        this.item = new User();
    }

    updateChecked(value: string, event: any) {
        console.log(event);
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
            this.userGrpUserSub = this.userSer.getUserGroupUsers(this.item.name)
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
            this.userProjSub = this.userSer.getUserProjects(this.item.name)
            .subscribe(res => {
                    this.projectCheckeds = [];
                    res.forEach(z => {
                        this.projectCheckeds.push(z.key);
                    });
            });
        }
    }
    ngOnDestroy() {
        if (this.userGrpUserSub) {this.userGrpUserSub.unsubscribe(); }
        if (this.userProjSub) {this.userProjSub.unsubscribe(); }
    }

    onUpdate() {
        // validate name
        // update user
        this.userSer.addItem(this.item);
        // update user project
        this.userSer.addUserProject(this.item.name, this.projectCheckeds);

        // update user group user
        this.userSer.addUserGroupUser(this.item.name, this.userGroupCheckeds);
        this.onCancel();
    }
    onChangeStatus(event) {
        // console.log(event)
        if (event.checked) {
            this.item.status = 'on';
        } else { this.item.status = 'off'; }
    }
    onSelectItem(item: User) {
        this.item = item;
        this.isShowUpdate = true;
        this.getUserProjects();
        this.getUserGroupUsers();
    }

    onRemoveItem(item: User) {
        if (confirm('Are you sure delete this item?')) {
            this.userSer.removeItem(item);
        }
    }
    onCancel() {
        this.isShowUpdate = false;
        this.flagAdd = false;
    }

}
