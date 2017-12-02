import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
  
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

import { ScheduleSetup } from './../schedule-setup/schedule-setup.model';
import { ScheduleSetupService } from './../schedule-setup/schedule-setup.service';
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
  guardDutyUsers: User[];
  weeksBetweenDates: number = 0;
  
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
    editableDateField	:false,
    showWeekNumbers:true,
    dayLabels:{su: 'Søn', mo: 'Man', tu: 'Tirs', we: 'Ons', th: 'Tors', fr: 'Fre', sa: 'Lør'},
    monthLabels: { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'Maj', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dec' }
  }

  constructor(private scheduleSetupService: ScheduleSetupService) {
    this.scheduleSetupService.getScheduleSetups().subscribe(setups => {
      this.scheduleSetup = setups != null && setups.length > 0 ? setups[0] : null;
      if(this.scheduleSetup != null){
        this.setStartDateInfo();
        this.setScheduleForCurrentWeek();
      }
    });
   }

  ngOnInit() {
  }

  setScheduleForCurrentWeek(){
    let today = new Date();
    this.resetDate(today);
    this.weeksBetweenDates = this.getWeeksBetweenDates(new Date(this.scheduleSetup.startDate), today);
    this.calculateTeams();
  }

  resetDate(date) {
    date.setHours(0,0,0);
    date.setDate(date.getDate() + 4 - (date.getDay()||7));
  }
  
  getWeekNumber(date) {
    date = new Date(+date);
    this.resetDate(date);
    var yearStart = new Date(date.getFullYear(),0,1);
    var weekNo = Math.ceil(( ( (date - yearStart.getTime()) / 86400000) + 1)/7)
    return weekNo;
  }

  getWeeksInYear(year) {
    var lastDayOfYear = new Date(year, 11, 31);
    var week = this.getWeekNumber(lastDayOfYear);
    return week == 1? this.getWeekNumber(lastDayOfYear.setDate(24)) : week;
  }

  getWeekNumberViewFriendly(week:number){
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

  getWeeksBetweenDates(startDate: Date, endDate: Date) {
    var WEEK = 1000 * 60 * 60 * 24 * 7;
    startDate.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);
    var startDateMs = startDate.getTime();
    var endDateMs = endDate.getTime();
    var differenceInMs = Math.abs(endDateMs - startDateMs);
    return Math.floor(differenceInMs / WEEK);
  } 

  switchDayForTeams(array: any,index:number) {
    var temp0 = array[index];
    var temp1 = array[index+1];

    array[index] = array[index+2];
    array[index+1] = array[index+3];

    array[index+2] = temp0;
    array[index+3] = temp1;
  }

  isEvenWeek():boolean {
    return this.weeksBetweenDates % 2 == 0;
  }

  switchTeamsForNRounds(users: User[], nRounds:number) {
    let outSiderIndex = 8;
    let timeToSwitch = 0;
    for(let rounds = 0; rounds < nRounds; rounds++) {
      this.swapItems(users, timeToSwitch, outSiderIndex);
      timeToSwitch++;
    }
  }

  composeUnevenWeekTeam(previousWeekUsers: User[], currenWeekUsers: User[]): User[]{
    return previousWeekUsers.slice(4, 8).concat(currenWeekUsers.slice(0,4).concat(currenWeekUsers.slice(8, 9)));
  }

  isWeekForSwitchingDay(weeksForIteration:number):boolean{
    return weeksForIteration === 2 || (weeksForIteration > 1 && weeksForIteration % 4 == 2);
  };

  getDefaultScheduleSetupUserArray():User[]{
    return this.scheduleSetup.users.slice();
  }

  calculateTeams() {
    if(this.isEvenWeek()) {
      this.guardDutyUsers = this.getDefaultScheduleSetupUserArray();
      this.switchTeamsForNRounds(this.guardDutyUsers, this.weeksBetweenDates);
      if(this.isWeekForSwitchingDay(this.weeksBetweenDates)) {
        this.switchDayForTeams(this.guardDutyUsers, 0);
        this.switchDayForTeams(this.guardDutyUsers, 4);
      }
    }
    else {
      let previousIterationUsers = this.getDefaultScheduleSetupUserArray();
      this.switchTeamsForNRounds(previousIterationUsers, this.weeksBetweenDates- 1);
      let previousIterationWeek = this.weeksBetweenDates - 1;
      if(this.isWeekForSwitchingDay(previousIterationWeek)) {
        this.switchDayForTeams(previousIterationUsers, 4);
      }
     
      let currentIterationUsers = this.getDefaultScheduleSetupUserArray();
      this.switchTeamsForNRounds(currentIterationUsers, this.weeksBetweenDates);
      let nextIterationWeek = this.weeksBetweenDates + 1;
      if(this.isWeekForSwitchingDay(nextIterationWeek)) {
        this.switchDayForTeams(currentIterationUsers, 0);
      }
      this.guardDutyUsers = this.composeUnevenWeekTeam(previousIterationUsers, currentIterationUsers);
    }
  }

  onDateChanged(event: IMyDateModel){
    if(event == null || event.jsdate == null)
      return;
    this.weeksBetweenDates = this.getWeeksBetweenDates(new Date(this.scheduleSetup.startDate), new Date(event.jsdate));
    this.calculateTeams();
  }

  moveWeekForward(){
    this.weeksBetweenDates = this.weeksBetweenDates + 1;
    this.calculateTeams();
  }

  moveWeekBackward(){
    let previousWeek = this.weeksBetweenDates - 1;
    this.weeksBetweenDates = previousWeek < 0 ? 0 :  previousWeek;
    this.calculateTeams();

  }
}
