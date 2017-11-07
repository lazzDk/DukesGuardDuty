import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

import { ScheduleSetup } from './schedule-setup.model';
import { User } from './../user/user.model';

@Component({
  selector: 'app-schedule-setup',
  templateUrl: './schedule-setup.component.html',
  styleUrls: ['./schedule-setup.component.css']
})
export class ScheduleSetupComponent implements OnInit {
  weeks: number[] = [44, 45, 46, 47, 48];
  scheduleSetup: ScheduleSetup;
  saved:boolean = false;
  scheduleSetupCollection: AngularFirestoreCollection<ScheduleSetup>;
  scheduleSetups: Observable<ScheduleSetup[]>;

  userCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
    editableDateField	:false,
    showWeekNumbers:true,
    dayLabels:{su: 'Søn', mo: 'Man', tu: 'Tirs', we: 'Ons', th: 'Tors', fr: 'Fre', sa: 'Lør'},
    monthLabels: { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'Maj', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dec' }
  }

 constructor(private db: AngularFirestore){
    this.userCollection = db.collection<User>('Users');
    this.users = this.userCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as User;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
    this.scheduleSetupCollection = db.collection<ScheduleSetup>('ScheduleSetup');
    this.scheduleSetups = this.scheduleSetupCollection.valueChanges();
  }

  ngOnInit() {
    let startDate = new Date();
    startDate = this.getMonday(startDate);
    startDate.setHours(0,0,0,0);
    this.scheduleSetup = {
      startDate: startDate.getDate(),
      users: new Array(8),
    };
  }

  getMonday(date) {
    date = new Date(date);
    var day = date.getDay(), diff = date.getDate() - day + (day == 0 ? -6:1);
    return new Date(date.setDate(diff));
  } 

  onDateChanged(event: IMyDateModel){
    if(event != null && event.jsdate != null) {
      let startDate = new Date(event.jsdate);
      startDate = this.getMonday(startDate);
      startDate.setHours(0,0,0,0);
      this.scheduleSetup.startDate = startDate.getTime();
    }
  }

  saveSchedule(){ 
    this.scheduleSetupCollection.add(this.scheduleSetup);
    this.saved = true;
  }
}
