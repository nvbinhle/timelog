import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import {ProjectService} from './services/project.service';

import {Project} from './models/project';

@Component({
   //  moduleId: module.id,
    selector: 'project-tpl',
     styleUrls: []
    , templateUrl: 'app/html/project.html'
    , directives: [
    ]
    , providers: [ProjectService]
})

export class ProjectComponent implements OnInit, OnDestroy  {
    items: Project[];
    private projectSub: Subscription;

    constructor(private projectSer: ProjectService) {
   //     console.log("con")      
        this.items = [];
    }

    getAll() {
        this.projectSub = this.projectSer.getItems().subscribe(res => {
            this.items = res;
         //    console.log(this.items + " in getAll()")
        });
    }

    ngOnDestroy() {
        this.projectSub.unsubscribe();
    }
    ngOnInit() {
        this.getAll();
       // console.log(this.items + " in init()")
    }
}
