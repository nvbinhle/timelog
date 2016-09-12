import { Injectable } from '@angular/core';
// import {Response} from '@angular/http';
import {Observable} from 'rxjs';

import { TimeLog } from '../models/timelog';


import { AngularFire, FirebaseObjectObservable,FirebaseListObservable } from 'angularfire2';
import {UserService} from './user.service';


@Injectable()
export class TimeLogLogsService {
    private urlRefLogs: string;

    private restTimeDefault: number = 1; // hour

    constructor(private angularFire2: AngularFire, private http: UserService) {
        // this.urlRefLogs = 'logTimes/' + month + '-' + year + '/' + this.http.user.name + '/logs';
    }
    getTimeLogLogsBy(day: number, month: number, year: number): FirebaseListObservable<TimeLog[]> {
        this.urlRefLogs = 'logTimes/' + month + '-' + year + '/' + this.http.user.name + '/logs';

        return this.angularFire2.database.list(this.urlRefLogs + '/' + day);
    }
    removeItem(day: number, month: number,year: number, key: string) {
        this.urlRefLogs = 'logTimes/' + month + '-' + year + '/' + this.http.user.name + '/logs';
        return this.angularFire2.database.list(this.urlRefLogs + '/' + day).remove(key);
    }
}
