import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app/';
import { LoginComponent } from './app/login.component';

import { TimeLogsComponent } from './app/timelogs.component';
import {TimeLogChartComponent} from './app/timelog-chart.component';
import { TimeLogUpdateComponent } from './app/timelog-update.component';
import {TimeLogLogsComponent} from './app/timelog-logs.component';
import {AddLogComponent} from './app/add-log.component';
import { UserComponent } from './app/user.component';
import {UserUpdateComponent} from './app/user-update.component';
import {UserAddComponent} from './app/user-add.component';
import { ProjectComponent } from './app/project.component';
import { ProjectAddComponent } from './app/add-project.component';
import { ProjectUpdateComponent } from './app/project-update.component';
import { ProjectTimeLogComponent } from './app/project-timelog.component';
import { ProjectTimeLogUpdateComponent } from './app/project-timelog-update.component';
// import {MenuTop} from './app/menu-top';

// import {enableProdMode,PLATFORM_DIRECTIVES} from '@angular/core';
import { HttpModule } from '@angular/http';

import { routing, appRoutingProviders  } from './app/routes';

import {AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
 // import * as firebase from 'firebase';
import { LocalStorageService } from 'angular2-localstorage/LocalStorageEmitter';
import 'hammerjs';
// import 'firebase';

import {UserService} from './app/services/user.service';
// import {ProjectService} from './app/services/project-service';
// import {TimeLogService} from './app/services/timelog-service';
// import {ProjectTimeLogService} from './app/services/project-timelog-service';
// import {TribesService} from './app/services/tribes-service';

import { FormsModule } from '@angular/forms';
import {MdInputModule} from '@angular2-material/input';
// import { NG2_DROPDOWN_DIRECTIVES } from 'ng2-material-dropdown';
import {MdGridListModule} from '@angular2-material/grid-list/grid-list';
import {MdIconModule , MdIconRegistry} from '@angular2-material/icon/icon';
import {MdCardModule} from '@angular2-material/card/card';
import {MdButtonModule} from '@angular2-material/button/button';
import {MdButtonToggleModule} from '@angular2-material/button-toggle';
import {MdSlideToggleModule} from '@angular2-material/slide-toggle';
import {MdCheckboxModule} from '@angular2-material/checkbox/checkbox';
import {MdToolbarModule} from '@angular2-material/toolbar';
import {MdRippleModule} from '@angular2-material/core/ripple/ripple';
import {MdRadioModule} from '@angular2-material/radio';
import {MdListModule} from '@angular2-material/list';
import {MdMenuModule} from '@angular2-material/menu';

export const firebaseConfig = {
        apiKey: 'AIzaSyB-f0V1k2g8IXKcr3NNO4JvETo5txrHbaI',
        authDomain: 'logtimenvg.firebaseapp.com',
        databaseURL: 'https://logtimenvg.firebaseio.com',
        storageBucket: 'logtimenvg.appspot.com'
   };
   export const firebaseAuthConfig = {
      provider: AuthProviders.Password,
      method: AuthMethods.Password
   };

@NgModule({
    declarations: [
          AppComponent
        , LoginComponent
        , TimeLogUpdateComponent, TimeLogLogsComponent, TimeLogsComponent, AddLogComponent, TimeLogChartComponent
        , UserComponent , UserUpdateComponent, UserAddComponent
        , ProjectComponent, ProjectUpdateComponent, ProjectAddComponent
        , ProjectTimeLogComponent , ProjectTimeLogUpdateComponent
       // ,MenuTop
    ],
    imports:      [
        BrowserModule
        // Router
       , routing
    // http
       , HttpModule
// angularfire
       , AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)

    // Forms
       , FormsModule
    // Material Design
       , MdToolbarModule
       , MdRippleModule
       , MdCheckboxModule
       , MdIconModule
       , MdButtonModule
       , MdGridListModule
       , MdCardModule
       , MdInputModule
      , MdButtonToggleModule
      , MdSlideToggleModule
      , MdRadioModule
      , MdListModule
      , MdMenuModule
    ],
    providers: [
        MdIconRegistry,
        appRoutingProviders,
        LocalStorageService,
        // LocalStorageSubscriber,
        UserService
        // , ProjectService, TimeLogService, ProjectTimeLogService, TribesService
    ],
    bootstrap:    [AppComponent],
})
export class AppModule {}
