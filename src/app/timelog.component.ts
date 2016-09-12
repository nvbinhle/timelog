import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
// import { NgFor  } from '@angular/common';

import {MaterializeDirective} from 'angular2-materialize';

import {TimeLogService} from './services/timelog.service';
import {UserService} from './services/user.service';

import {TimeLog} from './models/timelog';
import {User} from './models/user';

import {DEFAULT_MONTHS} from './shared/month';
import {DEFAULT_YEARS} from './shared/year';
import {DEFAULT_END_WORKING_TIME} from './shared/default-time.data';

import {MenuTop} from './menu-top';

@Component({
      moduleId: module.id    ,
     selector: 'time-log'
    , styleUrls: ['css/timelog.css']
    , templateUrl: 'html/timelog.html'
    , directives: [
        MenuTop, MaterializeDirective
    ]
    , providers: [TimeLogService]
    , pipes: []
    , encapsulation: ViewEncapsulation.None
})

export class TimeLogComponentbk implements OnInit {
    selectedItem: TimeLog;
    defaultEndTime: string = DEFAULT_END_WORKING_TIME;
    itemOnDay: TimeLog;
    items: TimeLog[];
    item: TimeLog;
    users: User[];
    totalHours: string;
    defaultMonths: number[] = DEFAULT_MONTHS;
    defaultYears: number[] = DEFAULT_YEARS;

    user: User;
    isRole: boolean = false;

    private sortValueDefault = 35;
    constructor(private tmService: TimeLogService, private userService: UserService) {
        this.item = new TimeLog;
        this.items = [];
    }

    firstLoad() {
        let date = new Date();
        let day = date.getDate();
        // add new item if this day hasn't data
        this.tmService.getTimeLogByDate(day).subscribe(resCheck => {
            if (resCheck.val() == null) {
                this.onAdd(this.defaultEndTime);
            }
        });
    }

    onAdd(endTime: string) {
        let date = new Date();
        let day = date.getDate();
        let localDate = date.toLocaleDateString();

        let locaEndTime = endTime;
        let locaStartTime = date.toLocaleTimeString();
        let spentTime = this.tmService.caculateTime(new Date(localDate + ' ' + locaStartTime)
            , new Date(localDate + ' ' + locaEndTime));

        let item = new TimeLog();
        item.date = localDate;
        item.startTime = locaStartTime;
        item.endTime = locaEndTime;
        item.spentTime = spentTime;
        item.sortKey = this.sortValueDefault - day;
        item.note = '';

        this.tmService.addItem(item, day);
    }

    onEndWorkingToday() {
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

      //  this.tmService.updateEndWorking(itemUpdate, day);
    }
    selectItem(timeLog: TimeLog) {
        this.selectedItem = timeLog;
    }

    getdata() {
        this.tmService.getTimeLogs()
            .subscribe(res => {
                    this.items = res;
                    this.totalHours = this.tmService.caculatorAllTime(res);
                }
            , error => console.log(error));
    }

    getUsers() {
        this.userService.getUsers().subscribe(res => {
            this.users = res;
        }, error => console.log(error));
    }

    onSearch(month: number, year: number, name: string) {

        this.tmService.getTimeLogsBy(month, year, name)
            .subscribe(res => {
                this.items = res;
                this.tmService.caculatorAllTime(res);
            }, error => console.log(error));
    }

    ngOnInit() {

        this.defaultEndTime = '18:00';

        this.itemOnDay = new TimeLog();

        let date = new Date();
        let day = date.getDate();

        this.tmService.getTimeLogByKey(day).subscribe(res => this.itemOnDay = res);
        // auto add start time when user go to this page
        this.firstLoad();

         this.user = new User();
        this.user.name = this.userService.user.name;
        this.isRole = this.userService.checkAdminRole(this.userService.user.role);

        // load data
        this.getdata();
        this.getUsers();
    }
}
