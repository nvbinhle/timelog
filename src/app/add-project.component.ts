import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import {ProjectService} from './services/project.service';
import {TribesService} from './services/tribes.service';

import {Project} from './models/project';

import {STATUSES_DATA} from './shared/status.data';

@Component({
   //  moduleId: module.id,
    selector: 'project-add-tpl',
     styleUrls: []
    , templateUrl: 'app/html/add-project.html'
    , directives: [
    ]
    , providers: [ProjectService, TribesService]
})

export class ProjectAddComponent implements OnInit, OnDestroy  {
    item: Project;
    tribes: string[] = [];

    status: string;
    statuses: string[] = STATUSES_DATA;

    private tribesSub: Subscription;

    constructor(private projectSer: ProjectService, private tribesSer: TribesService, private router: Router) {
        this.item = new Project();
        this.item.status = this.statuses[0];
    }
    onChangeStatus(event) {
        if (event.checked) {
            this.item.status = 'on';
        }
        else {this.item.status = 'off'; }
    }
    getTribes() {
        this.tribesSub = this.tribesSer.getItems().subscribe(res => {
            res.forEach(z => {
                if (this.tribes.indexOf(z.key) === -1)
                {
                    this.tribes.push(z.key);
                }
            });
            this.item.tribesId = (this.tribes[0] !== undefined ? this.tribes[0] : '');
        });
    }
    onUpdate() {
        // validate name        
        this.projectSer.addItem(this.item);
         this.router.navigate(['/projects']);
    }
    ngOnDestroy() {
        this.tribesSub.unsubscribe();
    }
    ngOnInit() {
        this.getTribes();
    }
}
