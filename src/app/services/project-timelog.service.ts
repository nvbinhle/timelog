import { Injectable } from '@angular/core';
// import {Response} from '@angular/http';
import {Observable} from 'rxjs';

import { ProjectTimeLog } from '../models/project-timelog';

import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import {UserService} from './user.service';

@Injectable()
export class ProjectTimeLogService {

    private urlRef: string;
     sortValueDefault: number = 35;

    constructor(private angularFire2: AngularFire, private http: UserService) {

        let date = new Date();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        // let userName = this._cookieService.getObject("us");
        this.urlRef = 'projectLogTimes/' + month + '-' + year + '/' + this.http.user.name;
    }
    getProjectTimeLogByKey(day: number, prjName: string): FirebaseObjectObservable<ProjectTimeLog> {

        return this.angularFire2.database.object(this.urlRef + '/' + day + '/' + prjName);
    }
    getProjectTimeLogByDay(day: number): Observable<ProjectTimeLog[]> {

        return this.angularFire2.database.list(this.urlRef + '/' + day);
    }
    getProjectTimeLogsBy(month: number, year: number, name: string): Observable<ProjectTimeLog[]> {

        if (month > 0 && year > 0 && name !== '') {
            let ref = 'projectLogTimes/' + month + '-' + year + '/' + name;

            return this.angularFire2.database.list(ref
                //    , {
        //        query: {
        //            orderByChild: "sortKey"
        //        }
        //    }
            );
        }
        return this.angularFire2.database.list(this.urlRef
        //    , {
        //        query: {
        //            orderByChild: "sortKey"
        //        }
        //    }
        );
    }
    removeItem(item: ProjectTimeLog) {
        let d = new Date(item.date);
        this.angularFire2.database.list(this.urlRef + '/' + d.getDate()).remove(item.projectName);
    }
    addProjectItem(item: ProjectTimeLog, day: number) {

        item.name = this.http.user.name;
        this.angularFire2.database.object(this.urlRef + '/' + day + '/' + item.projectName).set(item);
    }
    updateProjectItem(item: ProjectTimeLog, day: number) {
        item.name = this.http.user.name;
        this.angularFire2.database.object(this.urlRef + '/' + day + '/' + item.projectName).update({
            editDate: item.editDate,
            spentTime: item.spentTime,
            note: item.note
        });
    }

checkTimeValid(historyTime: number, spentTime: string, totalMinTimeLog: number) {
        let flafUpt: boolean = false;
        if (historyTime > 0) {
            let totalMinNow = historyTime + this.caculatorTime(spentTime, '.');
            console.log('client:' + totalMinNow);
            if (totalMinNow > totalMinTimeLog) {
                flafUpt = false;
            } else {
                flafUpt = true;
            }
        } else {
            let totalMinNow = this.caculatorTime(spentTime, '.');
            console.log('client:' + totalMinNow);
            if (totalMinNow > totalMinTimeLog) {
                flafUpt = false;
            } else {
                flafUpt = true;
            }
        }
        return flafUpt;
    }

    caculateListTimePrjUpt(prjs: any, projectName : string) {
        let totalMin: number = 0;
        for (let prj of prjs) {
            if (projectName !== prj.projectName) {
                    totalMin += this.caculatorTime(prj.spentTime, '.');
            }
        }

        return totalMin;
    }

    caculateListTimePrj(prjs: any) {
        let totalMin: number = 0;
        for (let prj of prjs) {
            totalMin += this.caculatorTime(prj.spentTime, '.');
        }

        return totalMin;
    }

    caculatorTime(time: string, split:string) {
        let oneHour = 60;
        let totalMinus = 0;

        let arr = time.split(split);

        if (arr.length === 2) {
            let hours = parseInt(arr[0], 0);
            let minutes = parseInt(arr[1], 0);

            totalMinus += (hours * oneHour) + minutes;
        }
        if (arr.length === 1) {
            let hours = parseInt(arr[0], 0);
            totalMinus += (hours * oneHour);
        }
        return totalMinus;
    }
}
