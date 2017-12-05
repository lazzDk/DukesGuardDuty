import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule  } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';
import { MyDatePickerModule  } from 'mydatepicker';

import { AdminComponent } from './admin/admin.component';
import { AccessService } from './admin/access.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { GuardDutyComponent } from './guard-duty/guard-duty.component';
import { GuardDutySwitchService } from './guard-duty/guard-duty-switch/guard-duty-switch.service';
import { GuardDutyScheduleCalculatorService } from './guard-duty/guard-duty-schedule-calculator.service';
import { ScheduleSetupComponent } from './schedule-setup/schedule-setup.component';
import { ScheduleSetupService } from './schedule-setup/schedule-setup.service';
import { UserComponent } from './user/user.component';
import { UserCreationComponent } from './user/user-creation/user-creation.component';
import { UserService } from './user/user.service';
import { GuardDutySwitchComponent } from './guard-duty/guard-duty-switch/guard-duty-switch.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    GuardDutyComponent,
    UserCreationComponent,
    ScheduleSetupComponent,
    AdminComponent,
    GuardDutySwitchComponent
  ],
  imports: [
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserModule,
    FormsModule,
    MyDatePickerModule
  ],
  providers: [ 
    AccessService,
    AuthService,
    GuardDutyScheduleCalculatorService,
    GuardDutySwitchService,
    ScheduleSetupService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
