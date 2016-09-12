import { Component, Input, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription }       from 'rxjs/Subscription';

import {TimeLogService} from './services/timelog.service';
import {TimeLog} from './models/timelog';

// import {FORM_DIRECTIVES} from '@angular/forms';
// import {DatePicker} from 'ng2-datepicker/ng2-datepicker';

@Component({
    // moduleId: module.id,
    selector: 'timelog-update'
    , styleUrls: ['app/css/timelog.css']
    , templateUrl: 'app/html/timelog-update.html'
    , directives: [
        // FORM_DIRECTIVES
        ]
    , providers: [TimeLogService]
})

export class TimeLogUpdateComponent implements OnInit {
    viewDate: string;
    items: any[] = [];

    private subParam: Subscription;
    private subData: Subscription;

    newItem: TimeLog;

    constructor(private tmService: TimeLogService, private route: ActivatedRoute,
        private router: Router) {
    }


    onAddItem() {

        let date = new Date(this.newItem.date);
        let day = date.getDate();

        let localStartTime = this.newItem.startTime;
        let locaEndTime = this.newItem.endTime;
        let localDate = this.newItem.date;

        let spentTime = this.tmService.caculateTime(new Date(localDate + ' '
            + (localStartTime.indexOf(':') !== -1 ? localStartTime : localStartTime + ':00'))
            , new Date(localDate + ' '
                + (locaEndTime.indexOf(':') !== -1 ? locaEndTime : locaEndTime + ':00')));

        // change data to update
        // add some new property     
        this.newItem.spentTime = spentTime;
        this.newItem.sortKey = date.getTime();
        this.newItem.weekNumber = this.tmService.getWeek(date);
        // end

        this.tmService.pushItem(this.newItem, day);

        this.onCancelItem();

    }

    onDeleteItem(key: string) {
        if (confirm('Are you sure delete this item?')) {
            let arr = this.viewDate.split('-');
            if (arr.length === 3) {
                let d = +arr[1];
                let m = +arr[0];
                let y = +arr[2];

                this.tmService.removeItem(d, m, y, key);
            }

        }
    }

    onCancelItem() {
        this.newItem = new TimeLog();
        this.newItem.date = this.viewDate.replace('-', '/').replace('-', '/');
    }
    getdata(d: number, m: number, y: number) {
         this.subData = this.tmService.getListTimeLogBy(d, m, y)
             .subscribe(res => {
                     this.items = res;
                 }
             , error => console.log(error));
    }
    ngOnInit() {
        this.newItem = new TimeLog();
        this.subParam = this.route.params.subscribe(params => {
            this.viewDate = params['date']; // let id = +params['id']:  (+) converts string 'id' to a number

            this.newItem.date = this.viewDate.replace('-', '/').replace('-', '/');

            let arr = this.viewDate.split('-');
            if (arr.length === 3) {
                let d = +arr[1];
                let m = +arr[0];
                let y = +arr[2];

                this.getdata(d, m, y);
            }
            else {
                console.log('nodata');
            }
        });
    }
}
