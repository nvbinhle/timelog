import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { TimeLogsComponent } from './timelogs.component';
import { TimeLogUpdateComponent } from './timelog-update.component';
import {AddLogComponent} from './add-log.component';
import {TimeLogLogsComponent} from './timelog-logs.component';
import { ProjectTimeLogComponent } from './project-timelog.component';

import { ProjectComponent } from './project.component';
import { ProjectAddComponent } from './add-project.component';
import {UserComponent} from './user.component';
import {UserAddComponent} from './user-add.component';

const routes: Routes = [
  {
        path: '',
        component: LoginComponent
    },
    {
        path: 'add-log',
        component : AddLogComponent
    },
    {
        path: 'timelogs',
        component: TimeLogsComponent
    },
    {
        path: 'timelogs/:date',
        component: TimeLogUpdateComponent
    },
    {
        path: 'timelog-logs/:date',
        component: TimeLogLogsComponent
    },
    {
        path: 'project-timelog',
        component: ProjectTimeLogComponent
    },
    {
        path: 'projects',
        component: ProjectComponent
    },
    {
        path: 'projects/create',
        component: ProjectAddComponent
    },
    {
        path: 'users',
        component: UserComponent
    },
    {
        path: 'users/create',
        component: UserAddComponent
    },
    {
        path: 'users/create/:name',
        component: UserAddComponent
    }
    // ,{ path: '**', component: PageNotFoundComponent }
];
export const appRoutingProviders: any[] = [

];
export const routing = RouterModule.forRoot(routes);
