import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {TimeLogLogsService} from './services/timelog-logs.service';
import {TimeLog} from './models/timelog';

import { Subscription }       from 'rxjs/Subscription';

@Component({
    // moduleId: module.id,
    selector: 'timelog-logs'
    , styleUrls: []
    , templateUrl: 'app/html/timelog-logs.html'
    , directives: [
        ]
    , providers: [TimeLogLogsService]
})

export class TimeLogLogsComponent implements OnInit, OnDestroy {
    items: TimeLog[];
    viewDate: string;

    private subParam: Subscription;
    private subData: Subscription;

    constructor(private tmLogsService: TimeLogLogsService, private route: ActivatedRoute,
        private router: Router) {
    }

    getdata(d: number, m: number, y: number) {
        this.subData = this.tmLogsService.getTimeLogLogsBy(d, m, y)
            .subscribe(res => {
                    this.items = res;
                }
            , error => console.log(error));
    }

    onDelete(item: any) {
        if (confirm('Are you sure delete this item?')) {
            this.subParam = this.route.params.subscribe(params => {

                this.viewDate = params['date']; // let id = +params['id']:  (+) converts string 'id' to a number

                let arr = this.viewDate.split('-');
                if (arr.length === 3) {
                    let d = +arr[1];
                    let m = +arr[0];
                    let y = +arr[2];

                    this.tmLogsService.removeItem(d, m, y, item.$key);
                }
            });
        }
    }

    ngOnInit() {
        this.subParam = this.route.params.subscribe(params => {
            this.viewDate = params['date']; // let id = +params['id']:  (+) converts string 'id' to a number
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

    ngOnDestroy() {
        this.subParam.unsubscribe();
        this.subData.unsubscribe();
    }
}
