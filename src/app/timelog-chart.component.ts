import { Component, OnInit, Input} from '@angular/core';
import { NgStyle } from '@angular/common';

import {TimeLogService} from './services/timelog.service';
import {UserService} from './services/user.service';

import {TimeLog, TimeLogChart} from './models/timelog';

@Component({
     selector: 'timelog-chart'
    , styleUrls: []
    , templateUrl: 'app/html/timelog-chart.html'
    , directives: [NgStyle]
    , providers: [TimeLogService]
})

export class TimeLogChartComponent implements OnInit {
    @Input() timelogs: TimeLog[];
    charts: TimeLogChart[] = [];

    private fullMinus: number = 24 * 60;
    constructor(private tmService: TimeLogService, private userService: UserService) {
    }

    getData() {
        this.timelogs.forEach(element => {
            let start = this.tmService.caculatorTime(element.startTime);
            let end = this.tmService.caculatorTime(element.startTime);

            let itemChart = new TimeLogChart();
            itemChart.start = start * 100 / this.fullMinus;
            itemChart.startTime = element.startTime;
            itemChart.end = end * 100 / this.fullMinus;
            itemChart.endTime = element.endTime;
            itemChart.desc = element.spentTime;
            itemChart.color = '#009688';

            this.charts.push(itemChart);
        });
    }

    ngOnInit() {
      //  this.getData();
    }
}
