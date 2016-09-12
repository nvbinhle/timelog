import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TimeLog } from '../models/timelog';
import { DEFAULT_END_MORNING, DEFAULT_BEGIN_AFTERNOON } from '../shared/default-time.data';

import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { UserService } from './user.service';

@Injectable()
export class TimeLogService {
    private urlRef: string;
    private urlRefLogs: string;

    private restTimeDefault: number = 1; // hour

    constructor(private angularFire2: AngularFire, private http: UserService) {
        let date = new Date();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        this.urlRef = 'logTimes/' + month + '-' + year + '/' + this.http.user.name + '/data';
        this.urlRefLogs = 'logTimes/' + month + '-' + year + '/' + this.http.user.name + '/logs';
    }

    getListTimeLogBy(day: number, month: number, year: number): Observable<any[]> {
        let ref = 'logTimes/' + month + '-' + year + '/' + this.http.user.name + '/data/' + day;

        return this.angularFire2.database.list(ref, {
                query: {
                    orderByChild: 'sortKey'
                }
            }
        );
    }
    getListTimeLogByKeyToCheck(day: number): FirebaseListObservable<any[]> {

        return this.angularFire2.database.list(this.urlRef + '/' + day, {
                query: {
                     limitToLast: 1
                }
            });
    }
    getListTimeLogByKey(day: number): FirebaseListObservable<any[]> {

        return this.angularFire2.database.list(this.urlRef + '/' + day);
    }
    getTimeLogByKey(day: number): FirebaseObjectObservable<TimeLog> {

        return this.angularFire2.database.object(this.urlRef + '/' + day);
    }
    getTimeLogByDate(day: number): FirebaseObjectObservable<any> {
        return this.angularFire2.database.object(this.urlRef + '/' + day, { preserveSnapshot: true });
    }
    getTimeLogsBy(month: number, year: number, name: string): FirebaseListObservable<TimeLog[]> {
        let ref = 'logTimes/' + month + '-' + year + '/' + name + '/data';
        return this.angularFire2.database.list(ref
            , {
                query: {
                    orderByChild: 'sortKey'
                  //   limitToLast: 7
                }
            }
        );
    }
    getTimeLogs(): FirebaseListObservable<any[]> {
        return this.angularFire2.database.list(this.urlRef
            , {
            query: {
                orderByChild: 'sortKey'
            }}
        );
        // return this.angularFire2.database.list('users')
        //    .map((res: Response) => res.json().data))
        //    .catch(error=>error);
        // return HEROES;
    }
    addLogs(item: TimeLog, day: number) {
        item.dateCreate = (new Date()).toString();
        let refLog = this.angularFire2.database.list(this.urlRefLogs + '/' + day);
        refLog.push(item);
    }
    pushItem(item: TimeLog, day: number) {
        item.name = this.http.user.name;
        this.angularFire2.database.list(this.urlRef + '/' + day).push(item);

        this.addLogs(item, day);
    }
    removeItem(day: number, month: number, year: number, key: string) {
        let ref = 'logTimes/' + month + '-' + year + '/' + this.http.user.name + '/data/' + day;

        this.angularFire2.database.list(ref).remove(key);
    }
    addItem(item: TimeLog, day: number) {
        item.name = this.http.user.name;
        this.angularFire2.database.object(this.urlRef + '/' + day).set(item);

        this.addLogs(item, day);
    }
    updateItem(item: TimeLog, day: number) {
        this.angularFire2.database.object(this.urlRef + '/' + day).update({
            startTime: item.startTime
            , endTime: item.endTime
            , spentTime: item.spentTime
            , note: item.note
        });

        let newItemLog = new TimeLog();
        newItemLog.spentTime = item.spentTime;
        newItemLog.date = item.date;
        newItemLog.endTime = item.endTime;
        newItemLog.startTime = item.startTime;
        newItemLog.note = item.note;
        newItemLog.name = this.http.user.name;

        this.addLogs(newItemLog, day);
    }
    updateEndWorking(item: TimeLog, day: number, key: string) {
        this.angularFire2.database.object(this.urlRef + '/' + day + '/' + key).update({
            endTime: item.endTime, spentTime: item.spentTime
        });

        let newItemLog = new TimeLog();
        newItemLog.spentTime = item.spentTime;
        newItemLog.date = item.date;
        newItemLog.endTime = item.endTime;
        newItemLog.startTime = item.startTime;
        newItemLog.note = item.note;
        newItemLog.name = this.http.user.name;
        this.addLogs(newItemLog, day);
    }

    caculatorAllTime(items: TimeLog[]) {
        let oneHour = 60;
        let totalMinus = 0;

        for (let item of items) {
            if (item.spentTime != null) {
                let arr = item.spentTime.split(':');

                if (arr.length === 2) {
                    let hours: number = parseInt(arr[0], 0);
                    let minutes: number = parseInt(arr[1], 0);

                    totalMinus += (hours * oneHour) + minutes;
                }else if (arr.length === 1) {
                    let hours: number = parseInt(arr[0], 0);

                    totalMinus += (hours * oneHour);
                }
            }
        }
        return  parseInt((totalMinus / oneHour).toString(), 0) + 'h:' + (totalMinus % oneHour) + '\'';
    }
    convertMinusToTimeString(totalMinus: number): string {
        let oneHour = 60;

        return  parseInt((totalMinus / oneHour).toString(), 0) + 'h:' + (totalMinus % oneHour) + '\'';
    }
    // change time string 8:00 to number in minutes
    // return total minus (number)
    caculatorTime(spentTime: string): number {
        let oneHour = 60;
        let totalMinus = 0;

        if (spentTime != null) {
            let arr = spentTime.split(':');

            if (arr.length >= 2) {
                let hours: number = parseInt(arr[0], 0);
                let minutes: number = parseInt(arr[1], 0);

                totalMinus += (hours * oneHour) + minutes;
            }else if (arr.length === 1) {
                let hours: number = parseInt(arr[0], 0);

                totalMinus += (hours * oneHour);
            }
        }

        return  totalMinus;
    }
    caculateTime(date1: Date, date2: Date) {
        // Get 1 day in milliseconds
        // var one_day = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        let date1_ms = date1.getTime();
        let date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        let difference_ms = date2_ms - date1_ms;
        // take out milliseconds
        difference_ms = difference_ms / 1000;
        // var seconds = Math.floor(difference_ms % 60);
        difference_ms = difference_ms / 60;
        let minutes = Math.floor(difference_ms % 60);
        difference_ms = difference_ms / 60;

        let hFrom = date1.getHours() + 1;
        let hTo = date2.getHours() + 1;

        let hours = Math.floor(difference_ms % 24);
        if (hFrom < DEFAULT_END_MORNING && hTo > DEFAULT_BEGIN_AFTERNOON) {
            hours -= this.restTimeDefault
        }

        return hours + ':' + minutes;
    }
    changeTime(time: number) {
        let oneHour = 60;
        let totalMinus = 0;
        let arr = time.toString().split('.');

        if (arr.length === 2) {
            let hours = parseInt(arr[0], 0);
            let percentMin = time - hours;

            totalMinus = (percentMin * oneHour);
            return (hours + 'h:' + Math.round(totalMinus) + '\'');
        }

        return time.toString();
    }
    getWeek( date: any ) {

        let onejan: any = new Date(date.getFullYear(), 0, 1);
        return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);

    }

    // See the "Take it slow" appendix
    // getHeroesSlowly() {
    //    return new Promise<Hero[]>(resolve =>
    //        setTimeout(() => resolve(HEROES), 2000) // 2 seconds
    //    );
    // }
}
