import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription }       from 'rxjs/Subscription';

import {TimeLogService} from './services/timelog.service';
import {UserService} from './services/user.service';

import {TimeLog, TimeLogVm} from './models/timelog';
import {User} from './models/user';
import {DEFAULT_MONTHS} from './shared/month';
import {DEFAULT_YEARS} from './shared/year';
import {DEFAULT_END_WORKING_TIME} from './shared/default-time.data';

import {TimeLogChartComponent} from './timelog-chart.component';

@Component({
      moduleId: module.id,
     selector: 'time-log'
    , styleUrls: ['css/timelog.css']
    , templateUrl: 'html/timelogs.html'
    , directives: [
        TimeLogChartComponent
    ]
    , providers: [TimeLogService]
})

export class TimeLogsComponent implements OnInit, OnDestroy {
    selectedItem: TimeLog;
    defaultEndTime: string = DEFAULT_END_WORKING_TIME;
    itemOnDay: TimeLog;
    items: TimeLogVm[];
    item: TimeLog;
    users: User[];
    totalHours: string = '0';

    defaultMonth: number;
    defaultYear: number;

    defaultMonths: number[] = DEFAULT_MONTHS;
    defaultYears: number[] = DEFAULT_YEARS;

    user: User;
    isRole: boolean = false;

    subData: Subscription;

    constructor(private tmService: TimeLogService, private userService: UserService
       , private router: Router) {
        this.item = new TimeLog;
        this.items = [];
    }

    onSelectItem(item: TimeLogVm) {
        if (item.date) {
            let day: string = item.date.replace('/', '-').replace('/', '-');
            this.router.navigate(['/timelogs', day]);
        }
    }
    onShowLogs(item: TimeLogVm) {
         if (item.date) {
            let day: string = item.date.replace('/', '-').replace('/', '-');
            this.router.navigate(['/timelog-logs', day]);
         }
    }
    getData(month: number, year: number, name: string) {
        this.subData = this.tmService.getTimeLogsBy(month, year, name).subscribe(res => {
            this.items = [];
               // console.log(res)
                // console.log(res[0].$key)
            let totalTime = 0;
                for (let day of res) {
                    // console.log(day)                    
                    // console.log("begin child for")
                    let totalTimeItem = 0;
                    let dateItem = '';
                    let arrItem = [];
                    for (let item in day) {
                        // don't get data of $key            
                        if (item !== '$key') {
                            let timeLogItem: TimeLog = day[item] ;
                            arrItem.push(timeLogItem);
                            dateItem = timeLogItem.date;

                            // console.log(timeLogItem + ": dtai")    

                            let time: number =  this.tmService.caculatorTime(timeLogItem.spentTime);
                            totalTimeItem  += time;
                            totalTime += time;
                        }
                    }
                    let itemVm = new TimeLogVm();
                    itemVm.timelogs = arrItem;
                    itemVm.date = dateItem;
                    itemVm.totalTime =     this.tmService.convertMinusToTimeString(totalTimeItem);
                   // console.log("end child for")
                   // console.log(itemVm) 
                    this.items.push(itemVm);
                }
                // console.log(this.items);
                this.totalHours = this.tmService.convertMinusToTimeString(totalTime);
            }
        , error => console.log(error));
    }

    getUsers() {
        this.userService.getUsers().subscribe(res => {
            this.users = res;
        }, error => console.log(error));
    }

    ngOnInit() {
        this.itemOnDay = new TimeLog();

        let date = new Date();

        this.defaultMonth = date.getMonth() + 1;
        this.defaultYear = date.getFullYear();

         this.user = new User();
        this.user.name = this.userService.user.name;
        this.isRole = this.userService.checkAdminRole(this.userService.user.role);

        // load data
        this.getData(this.defaultMonth, this.defaultYear, this.userService.user.name);
        this.getUsers();
    }
    ngOnDestroy() {
        this.subData.unsubscribe();
    }
}
