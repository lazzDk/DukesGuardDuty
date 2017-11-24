import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
  
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

import { ScheduleSetup } from './../schedule-setup/schedule-setup.model';
import { User } from './../user/user.model';

@Component({
  selector: 'app-guard-duty',
  templateUrl: './guard-duty.component.html',
  styleUrls: ['./guard-duty.component.css']
})
export class GuardDutyComponent implements OnInit {
  scheduleSetup: ScheduleSetup;
  startWeek:number = 0;
  maxWeeksInStartYear: number = 52;
  selectedWeek: number = 0;
  scheduleUsers: User[];
  weeksBetweenDates: number = 0;

  scheduleSetupCollection: AngularFirestoreCollection<ScheduleSetup>;
  scheduleSetups: Observable<ScheduleSetup[]>; 

  userCollection: AngularFirestoreCollection<User>;
  users: User[];

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
    editableDateField	:false,
    showWeekNumbers:true,
    dayLabels:{su: 'Søn', mo: 'Man', tu: 'Tirs', we: 'Ons', th: 'Tors', fr: 'Fre', sa: 'Lør'},
    monthLabels: { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'Maj', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dec' }
  }

  constructor(private db: AngularFirestore) {
    this.scheduleSetupCollection = db.collection<ScheduleSetup>('ScheduleSetup', ref => ref.where('startDate', '<=', Date.now()).orderBy('startDate'));
    this.scheduleSetupCollection.valueChanges().subscribe(setups => {
        this.scheduleSetup = setups != null && setups.length > 0 ? setups[0] : null;
        if(this.scheduleSetup != null){
          this.scheduleUsers = this.scheduleSetup.users.slice();
          this.setStartDateInfo();
        }
    });

    this.userCollection = db.collection<User>('Users');
    this.userCollection.valueChanges().subscribe(users => {
      this.users = users;
    });
   }

  ngOnInit() {
  }
  
  getWeekNumbers(date) {
    date = new Date(+date);
    date.setHours(0,0,0);
    date.setDate(date.getDate() + 4 - (date.getDay()||7));
    var yearStart = new Date(date.getFullYear(),0,1);
    var weekNo = Math.ceil(( ( (date - yearStart.getTime()) / 86400000) + 1)/7)
    return weekNo;
  }

  getWeeksInYear(year) {
    var d = new Date(year, 11, 31);
    var week = this.getWeekNumbers(d);
    return week == 1? this.getWeekNumbers(d.setDate(24)) : week;
  }

  getWeekNumber(week:number){
    let maxWeeks = this.startWeek + this.weeksBetweenDates + week;
     return maxWeeks > this.maxWeeksInStartYear ? maxWeeks - this.maxWeeksInStartYear : maxWeeks;
  }

  setStartDateInfo() {
    let date = new Date(this.scheduleSetup.startDate);
    var onejan = new Date(date.getFullYear(), 0, 1);
    this.startWeek = Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    this.maxWeeksInStartYear = this.getWeeksInYear(date.getFullYear());
  }

  swapItems(array: any, firstIndex:number, secondIndex:number) {
    if(array == null || firstIndex < 0 || firstIndex >= array.length || secondIndex < 0 || secondIndex >= array.length)
     return;

    var temp = array[firstIndex];
    array[firstIndex] = array[secondIndex];
    array[secondIndex] = temp; 
  }

  getWeeksBetweenTwoDates(date1: Date, date2: Date) {
    var WEEK = 1000 * 60 * 60 * 24 * 7;
    date1.setHours(0,0,0,0);
    date2.setHours(0,0,0,0);
    var date1ms = date1.getTime();
    var date2ms = date2.getTime();
    var diff = Math.abs(date2ms - date1ms);
    return Math.floor(diff / WEEK);
  } 

  switchTeams(array: any,index:number) {
    var temp0 = array[index];
    var temp1 = array[index+1];

    array[index] = array[index+2];
    array[index+1] = array[index+3];

    array[index+2] = temp0;
    array[index+3] = temp1;
  }

  onDateChanged(event: IMyDateModel){
    if(this.users == null || this.users.length == 0 || event == null || event.jsdate == null)
      return;
    this.weeksBetweenDates = this.getWeeksBetweenTwoDates(new Date(this.scheduleSetup.startDate), new Date(event.jsdate));
    
    let outSiderIndex = this.users.length - 1;
    if(this.weeksBetweenDates % 2 == 0) {
      let timeToSwitch = 0;
      this.scheduleUsers = this.scheduleSetup.users.slice(); 
      for(let rounds = 0; rounds < this.weeksBetweenDates; rounds++) {
        this.swapItems(this.scheduleUsers, timeToSwitch, outSiderIndex);
        timeToSwitch++;
      }
      if(this.weeksBetweenDates === 2 || (this.weeksBetweenDates > 1 && this.weeksBetweenDates % 4 == 2)) {
        this.switchTeams(this.scheduleUsers,0);
        this.switchTeams(this.scheduleUsers,4);
      }

    }
    else {
      let previousIterationUsers = this.scheduleUsers.slice();
      let timeToSwitchPrevious = 0;
      for(let rounds = 0; rounds < this.weeksBetweenDates - 1; rounds++) {
        this.swapItems(previousIterationUsers, timeToSwitchPrevious, outSiderIndex);
        timeToSwitchPrevious++;
      }
      let previousIterationWeeks = this.weeksBetweenDates - 1;
      if(previousIterationWeeks === 2 || (previousIterationWeeks > 1 && previousIterationWeeks % 4 == 2)) {
        this.switchTeams(previousIterationUsers, 4);
      }
     
      let timeToSwitchCurrent = 0;
      let currentIterationUsers = this.scheduleUsers.slice();
      for(let rounds = 0; rounds < this.weeksBetweenDates; rounds++) {
        this.swapItems(currentIterationUsers, timeToSwitchCurrent, outSiderIndex);
        timeToSwitchCurrent++;
      }
      let nextIterationWeeks = this.weeksBetweenDates + 1;
      if(nextIterationWeeks === 2 || (nextIterationWeeks > 1 && nextIterationWeeks % 4 == 2)) {
        this.switchTeams(currentIterationUsers,0);
      }

      this.scheduleUsers = previousIterationUsers.slice(4, 8).concat(currentIterationUsers.slice(0,4).concat(currentIterationUsers.slice(8, 9))) ;
    }
   
  }
}
