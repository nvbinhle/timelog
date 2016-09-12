import { Component, Input, OnDestroy} from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import {ProjectTimeLogService} from './services/project-timelog.service';
import {ProjectService} from './services/project.service';
import {TimeLogService} from './services/timelog.service';
import {UserService} from './services/user.service';

import { ProjectTimeLog } from './models/project-timelog';

@Component({
    // moduleId: module.id,
    selector: 'prj-time-log-update'
    , styleUrls: ['app/css/project-timelog-update.css']
    , templateUrl: 'app/html/project-timelog-update.html'
     , directives: []
    , providers: [ProjectTimeLogService, ProjectService, TimeLogService]
})

export class ProjectTimeLogUpdateComponent implements OnDestroy  {
    @Input() prjTimeLogItem: ProjectTimeLog;

    day: string;

    error: string = '';
    isSpentTimeEmpty = false;

    isShow: boolean = false;

   private  timelogKeySub: Subscription;
   private  proTimelogDaySub: Subscription;

    constructor(private tmService: ProjectTimeLogService
    , private projectService: ProjectService
        , private timelogService: TimeLogService, private userService: UserService
        ) {
        let date = new Date();
        this.day = date.toLocaleDateString();

    }
    onRemoveItem(item: ProjectTimeLog) {
        if (confirm('Are you sure delete this item?')) {
            this.tmService.removeItem(item);
        }
    }
     onSelectItem(item: ProjectTimeLog) {
         this.isShow = true;
        this.prjTimeLogItem = item;
    }

    onCancel() {
       this.isShow = false;
    }

   ngOnDestroy() {
      if (this.proTimelogDaySub) {this.proTimelogDaySub.unsubscribe(); }
      if ( this.timelogKeySub) {this.timelogKeySub.unsubscribe(); }
   }
    onUpdate() {
        let date = new Date(this.prjTimeLogItem.date);
        let day = date.getDate();

        // format 8.2
        let spentTime: string = this.prjTimeLogItem.spentTime;

        this.timelogKeySub = this.timelogService.getListTimeLogByKey(day).subscribe(res => {
            let totalMinTimeLog: number;
                res.forEach(element => {
                    totalMinTimeLog += this.tmService.caculatorTime(element.spentTime, ':');
                });
          //  console.log('all:' + totalMinTimeLog);

            let itemDb = [];
            this.proTimelogDaySub = this.tmService.getProjectTimeLogByDay(day)
                .subscribe(res => itemDb = res);

            let historyTime = this.tmService.caculateListTimePrjUpt(itemDb, this.prjTimeLogItem.projectName);
            let flafUpt: boolean = this.tmService.checkTimeValid(historyTime, spentTime, totalMinTimeLog);

         //   console.log(flafUpt);
            if (flafUpt) {
                let itemUpdate = new ProjectTimeLog();
                this.tmService.getProjectTimeLogByKey(day, this.prjTimeLogItem.projectName)
                    .subscribe(res => itemUpdate = res);

                // change data to update            
                itemUpdate.editDate = (new Date()).toString();
                itemUpdate.note = this.prjTimeLogItem.note != null ? this.prjTimeLogItem.note : '';
                itemUpdate.spentTime = this.prjTimeLogItem.spentTime;

                this.tmService.updateProjectItem(itemUpdate, day);

                this.prjTimeLogItem = null;
                this.error = '';
            } else {
                this.error = 'Total time of project must less than total working time in ' + this.day;
                console.log('error');
            }
        });
    }
}
