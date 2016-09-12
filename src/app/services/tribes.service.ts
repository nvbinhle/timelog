import { Injectable } from '@angular/core';

import {Tribes} from '../models/Tribes';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class TribesService {
    private urlRef: string;

    constructor(private angularFire2: AngularFire) {
        this.urlRef = 'tribes';
    }

    getItems(): FirebaseListObservable<any> {
        return this.angularFire2.database.list(this.urlRef, { preserveSnapshot: true });
    }
    removeItem(item: Tribes) {
        this.angularFire2.database.list(this.urlRef).remove(item);
    }
    addItem(item: Tribes) {
        this.angularFire2.database.list(this.urlRef).push(item);
    }
    updateItem(key: string, item: Tribes) {
        this.angularFire2.database.list(this.urlRef).update(key, item);
    }
}
