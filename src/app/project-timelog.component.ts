import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import {ProjectTimeLogService} from './services/project-timelog.service';
import {UserService} from './services/user.service';
import {TimeLogService} from './services/timelog.service';

import { ProjectTimeLog } from './models/project-timelog';
import {User} from './models/user';

import {DEFAULT_MONTHS} from './shared/month';
import {DEFAULT_YEARS} from './shared/year';
import {DEFAULT_END_WORKING_TIME} from './shared/default-time.data';

@Component({
    selector: 'project-time-log'
    , styleUrls: ['app/css/project-timelog.css']
     , templateUrl: 'app/html/project-timelog.html'
    , providers: [ProjectTimeLogService, TimeLogService]
    , directives: []
})
export class ProjectTimeLogComponent implements OnInit, OnDestroy {
    prjTimeLogItemAdd: ProjectTimeLog;

    error: string = '';
    isSpentTimeEmpty = false;
    day: string;
    prjItem: string = '';
    itemOnDay: ProjectTimeLog;
    items: ProjectTimeLog[];
    users: User[];
    projects: string[] = [];

    totalHours: string;

    defaultMonth: number;
    defaultYear: number;

    defaultMonths: number[] = DEFAULT_MONTHS;
    defaultYears: number[] = DEFAULT_YEARS;
    defaultEndTime: string = DEFAULT_END_WORKING_TIME;

    user: User;
    isRole: boolean = false;
    isAdd = true;

    private userProjSub: Subscription;
    private  projectSub: Subscription;
    private  userSub: Subscription;
    private  checkTimeLogSub: Subscription;
    private  getTimeLogSub: Subscription;
    private  getProTimeLogKeySub: Subscription;
    private  getProTimeLogDaySub: Subscription;

    constructor(private usrService: UserService, private prjLtService: ProjectTimeLogService
    , private timelogService: TimeLogService
    ) {
    }

    checkHasEndWorkingDayClick() {
         this.checkTimeLogSub = this.timelogService.getListTimeLogByKey(new Date().getDate()).subscribe(res => {
            if (res.length > 0) {
                this.isAdd = false;
            } else {
                this.isAdd = true;
            }
         });
    }

    onAdd() {
        let date = new Date();
        let day = date.getDate();

        // check project exist
        let itemUpdate = new ProjectTimeLog();
        this.getProTimeLogKeySub = this.prjLtService.getProjectTimeLogByKey(day, this.prjItem)
            .subscribe(res => itemUpdate = res);
       // console.log(itemUpdate);

        if (itemUpdate.date !== undefined && itemUpdate.date != null) {
            this.error = 'Please choose other project, this project exist in ' + this.day;
        } else {
            // format 8.2
            let spentTime: string = this.prjTimeLogItemAdd.spentTime;

           this.getTimeLogSub = this.timelogService.getListTimeLogByKey(day).subscribe(res => {
                let totalMinTimeLog: number;
                res.forEach(element => {
                    totalMinTimeLog += this.prjLtService.caculatorTime(element.spentTime, ':');
                });
               // console.log('all:' + totalMinTimeLog);

                let itemDb = [];
               this.getProTimeLogDaySub = this.prjLtService.getProjectTimeLogByDay(day)
                    .subscribe(res => itemDb = res);

                let historyTime = this.prjLtService.caculateListTimePrj(itemDb);
                let flafUpt: boolean = this.prjLtService.checkTimeValid(historyTime, spentTime, totalMinTimeLog);

               // console.log(flafUpt);
                if (flafUpt) {
                    // add data
                    let item = new ProjectTimeLog();
                    item.projectName = this.prjItem;
                    item.date = date.toLocaleDateString();
                    item.note = this.prjTimeLogItemAdd.note != null ? this.prjTimeLogItemAdd.note : '';
                    item.spentTime = this.prjTimeLogItemAdd.spentTime;

                    item.sortKey = this.prjLtService.sortValueDefault - day;
                    this.prjLtService.addProjectItem(item, day);
                    this.prjTimeLogItemAdd = new ProjectTimeLog();
                    this.error = '';
                } else {
                    this.error = 'Total time of project must less than total working time in ' + this.day;
                    console.log('error');
                }
            });
        }
    }

    getUsers() {
         this.userSub = this.usrService.getUsers().subscribe(res => {
            this.users = res;
        }, error => console.log(error));
    }

    onSearch(month: number, year: number, name: string) {
       this.projectSub = this.prjLtService.getProjectTimeLogsBy(month, year, name)
            .subscribe(res => {
                let totalTime = 0;
                this.totalHours = '';
                let arr = [];
                for (let prjs of res) {
                    for (let prj in prjs) {
                        if (prj !== '$key') {
                            // console.log(prj)
                            arr.push(prjs[prj]);

                            let time: number = parseFloat(prjs[prj].spentTime);
                            totalTime += time;
                        }
                    }
                }
                this.items = arr;
                // console.log(this.items)
                this.totalHours = this.timelogService.changeTime(totalTime);
                this.items.sort((a: ProjectTimeLog, b: ProjectTimeLog) => {
                    return a.sortKey - b.sortKey;
                });

            }, error => console.log(error));
    }

    getProjects() {
        if (this.usrService.user.name !== '') {
            this.userProjSub = this.usrService.getUserProjects(this.usrService.user.name)
            .subscribe(res => {
              //  console.log(this.usrService.user.name);
                this.projects = [];
                res.forEach(z => {
                    this.projects.push(z.key);
                });
                this.prjItem = this.projects[0];

            });
        }

    }
    ngOnDestroy() {
        this.projectSub.unsubscribe();
        this.userProjSub.unsubscribe();
        this.userSub.unsubscribe();
        this.checkTimeLogSub.unsubscribe();

        if (this.getTimeLogSub) {this.getTimeLogSub.unsubscribe(); }
        if (this.getProTimeLogKeySub) {this.getProTimeLogKeySub.unsubscribe(); }
        if (this.getProTimeLogDaySub) {this.getProTimeLogDaySub.unsubscribe(); }
    }
    ngOnInit() {
        let date = new Date();
        this.day = date.toLocaleDateString();

        this.defaultMonth = date.getMonth() + 1;
        this.defaultYear = date.getFullYear();

        this.prjTimeLogItemAdd = new ProjectTimeLog();
        this.user = this.usrService.user;
        this.isRole = this.usrService.checkAdminRole(this.usrService.user.role);

        // load data
        this.onSearch(0, 0, '');
        this.getUsers();
        this.getProjects();
        this.checkHasEndWorkingDayClick();
    }
}
