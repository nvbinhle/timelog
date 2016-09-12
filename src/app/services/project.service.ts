import { Injectable } from '@angular/core';

import {Project} from '../models/project';

import 'rxjs/add/operator/toPromise';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Injectable()
export class ProjectService {
    private urlRef: string;

    constructor(private angularFire2: AngularFire) {
        this.urlRef = 'projects';

    }

    getItems(): FirebaseListObservable<Project[]> {
        return this.angularFire2.database.list(this.urlRef);
    }
    getItemCheck(prjName: string): FirebaseObjectObservable<any> {
        return this.angularFire2.database.object(this.urlRef + '/' + prjName, { preserveSnapshot: true });
    }
    getItem(prjName: string): FirebaseObjectObservable<Project> {
        return this.angularFire2.database.object(this.urlRef + '/' + prjName);
    }
    removeItem(item: Project) {
        this.angularFire2.database.list(this.urlRef + '/' + item.name).remove();
    }
    addItem(item: Project) {
        this.angularFire2.database.object(this.urlRef + '/' + item.name)
            .set({
            name: item.name, note: item.note !== undefined ? item.note: '', status: item.status, tribesId: item.tribesId
        });
    }
    // updateItem(key: string, item: Project) {
    //     this.angularFire2.database.list(this.urlRef).update(key, item);
    // }
}
