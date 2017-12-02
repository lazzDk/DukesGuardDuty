import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

import { ScheduleSetup } from './../../schedule-setup/schedule-setup.model';
import { ScheduleSetupService } from './../../schedule-setup/schedule-setup.service';
import { User } from './../../user/user.model';
import { GuardDutySwitchService } from './guard-duty-switch.service';

@Component({
  selector: 'app-guard-duty-switch',
  templateUrl: './guard-duty-switch.component.html',
  styleUrls: ['./guard-duty-switch.component.css']
})
export class GuardDutySwitchComponent implements OnInit {
  scheduleSetup: ScheduleSetup;
  startWeek:number = 0;
  weeksBetweenDatesFrom: number = 0;
  weeksBetweenDatesTo: number = 0;
  maxWeeksInStartYear: number = 52;  
  
  guardDutyUsersFrom: User[];
  guardDutyUsersTo: User[];
  

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
    editableDateField	:false,
    showWeekNumbers:true,
    dayLabels:{su: 'Søn', mo: 'Man', tu: 'Tirs', we: 'Ons', th: 'Tors', fr: 'Fre', sa: 'Lør'},
    monthLabels: { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'Maj', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dec' }
  }

  constructor(private guardDutySwitchService: GuardDutySwitchService, private scheduleSetupService: ScheduleSetupService) { 
    this.scheduleSetupService.getScheduleSetups().subscribe(setups => {
    this.scheduleSetup = setups != null && setups.length > 0 ? setups[0] : null;
      if(this.scheduleSetup != null){
        this.setStartDateInfo();
      }
    });
  }

  ngOnInit() {
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


   getWeekNumberViewFriendly(week:number, weeksBetween:  number ){
    let maxWeeks = this.startWeek + weeksBetween + week;
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

  isEvenWeek(weekNumber: number):boolean {
    return weekNumber % 2 == 0;
  }
  calculateTeams(guardDutyUsers: User[], weeksBetween: number) {
    if(this.isEvenWeek(weeksBetween)) {
      guardDutyUsers = this.getDefaultScheduleSetupUserArray();
      this.switchTeamsForNRounds(guardDutyUsers, weeksBetween);
      if(this.isWeekForSwitchingDay(weeksBetween)) {
        this.switchDayForTeams(guardDutyUsers, 0);
      }
      return guardDutyUsers.slice(0, 4).concat(guardDutyUsers.slice(8, 9));
    }
    else {
      let previousIterationUsers = this.getDefaultScheduleSetupUserArray();
      this.switchTeamsForNRounds(previousIterationUsers, weeksBetween- 1);
      let previousIterationWeek = weeksBetween - 1;
      if(this.isWeekForSwitchingDay(previousIterationWeek)) {
        this.switchDayForTeams(previousIterationUsers, 4);
      }
       return previousIterationUsers.slice(0, 4).concat(previousIterationUsers.slice(8, 9));
    }
  }


  onFromDateChanged(event: IMyDateModel){
    if(event == null || event.jsdate == null)
      return;
    this.weeksBetweenDatesFrom = this.getWeeksBetweenDates(new Date(this.scheduleSetup.startDate), new Date(event.jsdate));
    let users = this.calculateTeams(this.guardDutyUsersFrom, this.weeksBetweenDatesFrom);
    this.guardDutyUsersFrom = users;
  }

  onToDateChanged(event: IMyDateModel){
    if(event == null || event.jsdate == null)
      return;
    this.weeksBetweenDatesTo = this.getWeeksBetweenDates(new Date(this.scheduleSetup.startDate), new Date(event.jsdate));
    let users = this.calculateTeams(this.guardDutyUsersTo, this.weeksBetweenDatesTo);
    this.guardDutyUsersTo = users;
  }

  moveFromForward(){
    this.weeksBetweenDatesFrom = this.weeksBetweenDatesFrom + 1;
    let users = this.calculateTeams(this.guardDutyUsersFrom, this.weeksBetweenDatesFrom);
    this.guardDutyUsersFrom = users;
  }

  moveFromBackward(){
    let previousWeek = this.weeksBetweenDatesFrom - 1;
    this.weeksBetweenDatesFrom = previousWeek < 0 ? 0 :  previousWeek;
    let users = this.calculateTeams(this.guardDutyUsersFrom, this.weeksBetweenDatesFrom);
    this.guardDutyUsersFrom = users;

  }

  moveToForward(){
    this.weeksBetweenDatesTo = this.weeksBetweenDatesTo + 1;
    let users = this.calculateTeams(this.guardDutyUsersTo, this.weeksBetweenDatesTo);
    this.guardDutyUsersTo = users;
  }

  moveToBackward(){
    let previousWeek = this.weeksBetweenDatesTo - 1;
    this.weeksBetweenDatesTo = previousWeek < 0 ? 0 :  previousWeek;
    let users = this.calculateTeams(this.guardDutyUsersTo, this.weeksBetweenDatesTo);
    this.guardDutyUsersTo = users;

  }
  
  switchFromUser: User;
  switchToUser: User;
  
  setFrom(user: User) {
    console.log("hello from setFrom");
    this.switchFromUser = user;
  }
  
  setTo(user: User) {
    this.switchToUser = user;
    console.log("hello from setTo");
  }

  saveSwitch(){
    this.guardDutySwitchService.addGuardDutySwitch(this.weeksBetweenDatesFrom, this.switchFromUser, this.weeksBetweenDatesTo, this.switchToUser, this.scheduleSetup.id);
  }
  

}
