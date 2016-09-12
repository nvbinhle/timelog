export class TimeLog {
    date: string;
    dateCreate: string;
    startTime: string;
    endTime: string;
    spentTime: string;
    note: string;
    name: string;
    sortKey: number;
    weekNumber: number;
}

export class TimeLogVm {
    date: string;
    totalTime: string;
    timelogs: TimeLog[] = [];
}

export class TimeLogChart{
    start: number;
    startTime: string;
    end: number;
    endTime: string;
    desc: string;
    color: string;
}