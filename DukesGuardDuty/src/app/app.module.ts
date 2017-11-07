import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule  } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { MyDatePickerModule  } from 'mydatepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { GuardDutyComponent } from './guard-duty/guard-duty.component';
import { UserCreationComponent } from './user/user-creation/user-creation.component';
import { ScheduleSetupComponent } from './schedule-setup/schedule-setup.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    GuardDutyComponent,
    UserCreationComponent,
    ScheduleSetupComponent
  ],
  imports: [
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserModule,
    FormsModule,
    MyDatePickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
