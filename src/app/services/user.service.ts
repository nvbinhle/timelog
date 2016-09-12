import { Injectable } from '@angular/core';

 import { Response }  from '@angular/http';
 import { Observable }     from 'rxjs/Observable';

import { User } from '../models/user';
// import {UserLogin}  from '../models/user-login';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable}  from 'angularfire2';

import { LocalStorage } from 'angular2-localstorage/WebStorage';

@Injectable()
export class UserService {

    private urlRef: string;
    private urlUsrPrjRef: string;
    private urlUsrGroupUserRef: string;
    private urlUsrGroupRef: string;

  @LocalStorage() public user: User;

    constructor(private angularFire2: AngularFire) {
        this.urlRef = 'users';
        this.urlUsrPrjRef = 'userProjects';
        this.urlUsrGroupRef = 'userGroups';
        this.urlUsrGroupUserRef = 'userGroupUsers';
        this.user = new User();
    }
     removeItem(item: User) {
        this.angularFire2.database.list(this.urlRef + '/' + item.name).remove();
    }
    addItem(item: User) {
        this.angularFire2.database.object(this.urlRef + '/' + item.name)
            .set({
                name: item.name,
                note: item.note !== undefined ? item.note : '',
                status: item.status,
                role: item.role,
                password: item.password,
                ip: item.ip !== undefined ? item.ip : '',
                macAddress: item.macAddress !== undefined ? item.macAddress : '',
                email: item.email !== undefined ? item.email : '',
                phone: item.phone !== undefined ? item.phone : '',
                avarta: item.avarta !== undefined ? item.avarta : ''
            });
    }
    addUserProject(userName: string, prjs: string []) {
        let p = this.angularFire2.database.object(this.urlUsrPrjRef + '/' + userName).remove();
        p.then(_ => {
                for (let item of prjs) {
                    this.angularFire2.database.object(this.urlUsrPrjRef + '/' + userName + '/' + item).set('on');
                }
            })
            .catch(err => console.log(err, 'You dont have access!'));
    }
    addUserGroupUser(userName: string, urgs: string[]) {
        let p = this.angularFire2.database.object(this.urlUsrGroupUserRef + '/' + userName).remove();
        p.then(_ => {
            for (let item of urgs) {
                this.angularFire2.database.object(this.urlUsrGroupUserRef + '/' + userName + '/' + item).set('on');
            }
        })
            .catch(err => console.log(err, 'You dont have access!'));
    }
    getUserProjects(userName: string): FirebaseListObservable<any> {
        return this.angularFire2.database.list(this.urlUsrPrjRef + '/' + userName , { preserveSnapshot: true });
    }
    getUserGroups(): FirebaseListObservable<any> {
        return this.angularFire2.database.list(this.urlUsrGroupRef, { preserveSnapshot: true });
    }
    getUserGroupUsers(userName: string): FirebaseListObservable<any> {
        return this.angularFire2.database.list(this.urlUsrGroupUserRef + '/' + userName, { preserveSnapshot: true });
    }
    getUser(userName: string): FirebaseObjectObservable<any> {
        return this.angularFire2.database.object(this.urlRef + '/' + userName , { preserveSnapshot: true });
    }
    getUserObject(userName: string): FirebaseObjectObservable<any> {
        return this.angularFire2.database.object(this.urlRef + '/' + userName);
    }
    getUsers() {
        return this.angularFire2.database.list(this.urlRef);
    }
        
    checkAdminRole(role: string) {
        if (role != null && role.indexOf('admin') !== -1) {
            return true;
        }
        return false;
    }
    login(userName: string, password: string) {

        return this.angularFire2.database.list(this.urlRef, {
            query: {
                orderByChild: 'name',
                equalTo: userName
            }
        }
            // , { preserveSnapshot: true }
        );
    }
    loginDb() {
        this.angularFire2.auth.login(
            { email: 'tuannguyen@nhatvietgroup.com.vn', password: '123456' }
        ).then((success) => {
           // console.log('logindb ok');
            // get ip or identity key of computer and compare with db
        });
    }
    checkLogin() {
        this.angularFire2.auth.subscribe(auth => {
            console.log(auth);
        });
    }
}
