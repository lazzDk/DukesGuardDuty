import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

import { ScheduleSetup } from './schedule-setup.model';
import { User } from './../user/user.model';
import { UserService} from './../user/user.service';
import { ScheduleSetupService } from './schedule-setup.service';

@Component({
  selector: 'app-schedule-setup',
  templateUrl: './schedule-setup.component.html',
  styleUrls: ['./schedule-setup.component.css']
}) 

export class ScheduleSetupComponent implements OnInit {
  weeks: number[] = [44, 45, 46, 47, 48];
  scheduleSetup: ScheduleSetup;
  saved:boolean = false;
  scheduleSetups: Observable<ScheduleSetup[]>;

  users: Observable<User[]>;

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
    editableDateField	:false,
    showWeekNumbers:true,
    dayLabels:{su: 'Søn', mo: 'Man', tu: 'Tirs', we: 'Ons', th: 'Tors', fr: 'Fre', sa: 'Lør'},
    monthLabels: { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'Maj', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dec' }
  }

 constructor(private scheduleSetupService: ScheduleSetupService, private userService: UserService){
    this.users = this.userService.getUsers();
    this.scheduleSetups = this.scheduleSetupService.getScheduleSetups();
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
    this.scheduleSetupService.addScheduleSetup(this.scheduleSetup);
    this.saved = true;
  }
}
