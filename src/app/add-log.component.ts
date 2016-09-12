import { Component, OnInit, ViewEncapsulation  } from '@angular/core';

import {TimeLogService} from './services/timelog.service';
import {UserService} from './services/user.service';

import {TimeLog} from './models/timelog';
import {User} from './models/user';

import {DEFAULT_END_WORKING_TIME} from './shared/default-time.data';

@Component({
      moduleId: module.id    ,
     selector: 'time-log'
    , styleUrls: ['css/timelog.css']
    , templateUrl: 'html/add-log.html'
    , directives: [
    ]
    , providers: [TimeLogService]
})

export class AddLogComponent implements OnInit {
    defaultEndTime: string = DEFAULT_END_WORKING_TIME;

    itemOnDay: TimeLog;
    itemKey: string;

    user: User;
    isRole: boolean = false;

    clock: string = '';

    constructor(private tmService: TimeLogService, private userService: UserService) {
    }

    showClock() {
        let today = new Date();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        let mm = this.checkTime(m);
        let ss = this.checkTime(s);
        this.clock = h + ':' + mm + ':' + ss;
        let t = setTimeout(() => this.showClock(), 1000);
    }

    checkTime(i: number) {
        let s: string = i.toString();
        if (i < 10) {s = '0' + i; };  // add zero in front of numbers < 10
        return s;
    }

    onStart() {
        let date = new Date();
        let day = date.getDate();
        let localDate = date.toLocaleDateString();

        let locaEndTime = this.defaultEndTime;
        let locaStartTime = date.toLocaleTimeString();
        let spentTime = this.tmService.caculateTime(new Date(localDate + ' ' + locaStartTime)
            , new Date(localDate + ' ' + locaEndTime));

        let item = new TimeLog();
        item.date = localDate;
        item.startTime = locaStartTime;
        item.endTime = locaEndTime;
        item.spentTime = spentTime;
        item.sortKey = date.getTime();
        item.note = '';
        item.weekNumber = this.tmService.getWeek(date);
        // console.log(item)
        this.tmService.pushItem(item, day);
    }

    onEnd() {
        let date = new Date();
        let day = date.getDate();

        let itemUpdate = new TimeLog();
        itemUpdate = this.itemOnDay;

        let localDate = date.toLocaleDateString();
        let locaEndTime = date.toLocaleTimeString();

        let spentTime = this.tmService.caculateTime(new Date(localDate + ' ' + itemUpdate.startTime)
            , new Date(localDate + ' ' + locaEndTime));

        // change data to update
        itemUpdate.endTime = date.toLocaleTimeString();
        itemUpdate.spentTime = spentTime;

        this.tmService.updateEndWorking(itemUpdate, day, this.itemKey);
        this.itemOnDay.endTime = itemUpdate.endTime;
    }

    ngOnInit() {
        this.showClock() ;
        this.itemOnDay = new TimeLog();
        this.itemKey = '';
        let date = new Date();
        let day = date.getDate();

        this.tmService.getListTimeLogByKeyToCheck(day).subscribe(res => {
            if (res.length > 0) {
                this.itemOnDay = res[0];
                this.itemKey = res[0].$key;
               //  console.log(this.itemOnDay)
            }
        });

        this.user = new User();
        this.user.name = this.userService.user.name;
        this.isRole = this.userService.checkAdminRole(this.userService.user.role);
    }
}
