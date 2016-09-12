import { Component, Input } from '@angular/core';

import {ProjectService} from './services/project.service';

import {Project} from './models/project';

import {STATUSES_DATA} from './shared/status.data';

@Component({
   //  moduleId: module.id,
    selector: 'project-update-tpl',
     styleUrls: []
    , templateUrl: 'app/html/project-update.html'
    , directives: []
    , providers: [ProjectService]

})

export class ProjectUpdateComponent  {
    @Input() item: Project;
    @Input() tribes: string[];

   status: string;
    statuses: string[] = STATUSES_DATA;

    isShow: boolean = false;

    constructor(private projectSer: ProjectService) {
    }

    onUpdate() {
        // validate name        
        this.projectSer.addItem(this.item);

        this.onCancel();
    }

    onSelectItem(item: Project) {
        this.item = item;
        this.isShow = true;
    }
    onCancel() {
        this.isShow = false;
    }
    onRemoveItem(item: Project) {
        if (confirm('Are you sure delete this item?')) {
            this.projectSer.removeItem(item);
        }
    }
onChangeStatus(event) {
        // console.log(event)
        if (event.checked) {
            {this.item.status = 'on'; }
        }
        else {this.item.status = 'off'; }
    }
}
