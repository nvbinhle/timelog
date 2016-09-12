import { Component, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {TimeLogService} from './services/timelog.service';
import {TimeLog} from './models/timelog';

// import {FORM_DIRECTIVES} from '@angular/forms';
// import {DatePicker} from 'ng2-datepicker/ng2-datepicker';

@Component({
    // moduleId: module.id,
    selector: 'timelog-update'
    , styleUrls: ['app/css/timelog.css']
    , templateUrl: 'app/html/timelog-updatebk.html'
    , directives: [
        // FORM_DIRECTIVES
        ]
    , providers: [TimeLogService]
})

export class TimeLogUpdateComponentBk {
    @Input() timeLogItem: TimeLog;

    isShow: boolean = false;
    constructor(private tmService: TimeLogService, private route: ActivatedRoute,
        private router: Router) {
    }

    onUpdate() {
        let date = new Date(this.timeLogItem.date);
        let day = date.getDate();
        let itemUpdate = new TimeLog();
        this.tmService.getTimeLogByKey(day).subscribe(res => itemUpdate = res[0]);

        let localStartTime = this.timeLogItem.startTime;
        let locaEndTime = this.timeLogItem.endTime;
        let localDate = this.timeLogItem.date;

        let spentTime = this.tmService.caculateTime(new Date(localDate + ' '
            + (localStartTime.indexOf(':') !== -1 ? localStartTime : localStartTime + ':00'))
            , new Date(localDate + ' '
                + (locaEndTime.indexOf(':') !== -1 ? locaEndTime : locaEndTime + ':00')));

        // change data to update
        itemUpdate.startTime = localStartTime;
        itemUpdate.endTime = locaEndTime;
        itemUpdate.note = this.timeLogItem.note != null ? this.timeLogItem.note : '';
        itemUpdate.spentTime = spentTime;

        this.tmService.updateItem(itemUpdate, day);
        this.timeLogItem = null;
        this.onCancel();
    }
    onSelectItem(item: TimeLog) {
        this.timeLogItem = item;
        this.isShow = true;
    }
    onShowLogs(item: TimeLog) {
        let day = item.date.replace('/', '-').replace('/', '-');

        this.router.navigate(['/timelog-logs', day]);
    }
    onCancel() {
        this.isShow = false;
    }

}
