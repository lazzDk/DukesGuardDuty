import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ISubscription } from "rxjs/Subscription";

import { IMyDpOptions,IMyDate, IMyDateModel } from 'mydatepicker';

import { ScheduleSetup } from './../../schedule-setup/schedule-setup.model';
import { ScheduleSetupService } from './../../schedule-setup/schedule-setup.service';
import { User } from './../../user/user.model';
import { GuardDutySwitchService } from './guard-duty-switch.service';
import { GuardDutyScheduleCalculatorService } from './../guard-duty-schedule-calculator.service';

import { GuardDutySwitch } from './guard-duty-switch.model';
import { DatePickerOptionService } from './../../shared/date-picker-option.service';
 
@Component({
  selector: 'app-guard-duty-switch',
  templateUrl: './guard-duty-switch.component.html',
  styleUrls: ['./guard-duty-switch.component.css']
})
export class GuardDutySwitchComponent implements OnInit, OnDestroy {
  scheduleSetup: ScheduleSetup;
  startWeek:number = 0;
  weeksBetweenDatesFrom: number = 0;
  weeksBetweenDatesTo: number = 0;
  maxWeeksInStartYear: number = 52;  
  errorMessage: string = '';

  private selFromDate: IMyDate 
  private selToDate: IMyDate 

  private scheduleSetupSubscription: ISubscription;
  private guardDutyService: ISubscription;

  guardDutySwitches: GuardDutySwitch[];
  guardDutyUsersFrom: User[];
  guardDutyUsersTo: User[];

  myDatePickerOptions: IMyDpOptions; 
 
  constructor(
    private guardDutySwitchService: GuardDutySwitchService, 
    private scheduleCalculator:GuardDutyScheduleCalculatorService, 
    private scheduleSetupService: ScheduleSetupService,
    private datePickerOptionService: DatePickerOptionService) {
    
   }

  ngOnInit() {
    this.myDatePickerOptions = this.datePickerOptionService.getDatePickerOptions();
    
    this.scheduleSetupSubscription = this.scheduleSetupService.getMappedScheduleSetup().subscribe(setups => {
      this.scheduleSetup = setups != null && setups.length > 0 ? setups[0] : null;
        if(this.scheduleSetup != null){
          this.setStartDateInfo();
        }
      });
      this.guardDutyService = this.guardDutySwitchService.getGuardDutySwitches().subscribe(dutySwitches => {
        this.guardDutySwitches = dutySwitches;
      });
      
  }

  ngOnDestroy(){
   if(this.scheduleSetupSubscription != null)
      this.scheduleSetupSubscription.unsubscribe();
    if(this.guardDutyService != null)
      this.guardDutyService.unsubscribe();
   }

  getWeekNumberViewFriendly(week:number, weeksBetween:  number ){
    let maxWeeks = this.startWeek + weeksBetween + week;
    return maxWeeks > this.maxWeeksInStartYear ? maxWeeks - this.maxWeeksInStartYear : maxWeeks;
  } 

  setStartDateInfo() {
    let date = new Date(this.scheduleSetup.startDate);
    var onejan = new Date(date.getFullYear(), 0, 1);
    this.startWeek = Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    this.maxWeeksInStartYear = this.scheduleCalculator.getWeeksInYear(date.getFullYear());
  }

  composeUnevenWeekTeam(previousWeekUsers: User[], currenWeekUsers: User[]): User[]{
    return previousWeekUsers.slice(4, 8).concat(currenWeekUsers.slice(0,4).concat(currenWeekUsers.slice(8, 9)));
  }

  getDefaultScheduleSetupUserArray():User[]{
    return this.scheduleSetup.users.slice();
  }

  calculateTeams(guardDutyUsers: User[], weeksBetween: number) {
    if(this.scheduleCalculator.isEvenWeek(weeksBetween)) {
      guardDutyUsers = this.getDefaultScheduleSetupUserArray();
      this.scheduleCalculator.switchTeamsForNRounds(guardDutyUsers, weeksBetween);
      if(this.scheduleCalculator.isWeekForSwitchingDay(weeksBetween)) {
        this.scheduleCalculator.switchDayForTeams(guardDutyUsers, 0);
      }
      return guardDutyUsers.slice(0, 4).concat(guardDutyUsers.slice(8, 9));
    }
    else {
      let previousIterationUsers = this.getDefaultScheduleSetupUserArray();
      this.scheduleCalculator.switchTeamsForNRounds(previousIterationUsers, weeksBetween- 1);
      let previousIterationWeek = weeksBetween - 1;
      if(this.scheduleCalculator.isWeekForSwitchingDay(previousIterationWeek)) {
        this.scheduleCalculator.switchDayForTeams(previousIterationUsers, 4);
      }
      return previousIterationUsers.slice(4, 8).concat(previousIterationUsers.slice(8, 9));
    }
  }
   
  swapUsers(fromUser: User, toUser:User, guardDutyUsers: User[], ) {
    let index = guardDutyUsers.findIndex(user => user.id == fromUser.id);
    if(index != -1) {
      guardDutyUsers[index] = toUser;
    } 
  }

  switchUsers(fromUser: User, toUser:User,guardDutyUsers: User[], ) {
    let indexFrom = guardDutyUsers.findIndex(user => user.id == fromUser.id);
    let indexTo = guardDutyUsers.findIndex(user => user.id == toUser.id);
    if(indexFrom != -1 && indexTo != -1) {
      guardDutyUsers[indexFrom] = toUser;
      guardDutyUsers[indexTo] = fromUser;
    } 
  }

  handleDutySwitches(guardDutyUsers: User[], weeksBetween: number) {
    if(this.guardDutySwitches != null && this.guardDutySwitches.length > 0) {
      let switchesFromCurrentWeek = this.guardDutySwitches.filter(dutySwitch => dutySwitch.fromWeek == weeksBetween);
      let switchesToThisWeek = this.guardDutySwitches.filter(dutySwitch => dutySwitch.toWeek == weeksBetween);
     
      switchesFromCurrentWeek.forEach(dutySwitch => {
        this.swapUsers(dutySwitch.fromUser, dutySwitch.toUser, guardDutyUsers);
      });
      switchesToThisWeek.forEach(dutySwitch => {
        this.swapUsers(dutySwitch.toUser, dutySwitch.fromUser, guardDutyUsers);
      });
    }
  }
 
  onFromDateChanged(event: IMyDateModel){
    if(event == null || event.jsdate == null)
      return;
    this.weeksBetweenDatesFrom = this.scheduleCalculator.getWeeksBetweenDates(new Date(this.scheduleSetup.startDate), new Date(event.jsdate));
    let users = this.calculateTeams(this.guardDutyUsersFrom, this.weeksBetweenDatesFrom);
    this.handleDutySwitches(users, this.weeksBetweenDatesFrom);
    this.guardDutyUsersFrom = users;
  }

  onToDateChanged(event: IMyDateModel){
    if(event == null || event.jsdate == null)
      return;
    this.weeksBetweenDatesTo = this.scheduleCalculator.getWeeksBetweenDates(new Date(this.scheduleSetup.startDate), new Date(event.jsdate));
    let users = this.calculateTeams(this.guardDutyUsersTo, this.weeksBetweenDatesTo);
    this.handleDutySwitches(users, this.weeksBetweenDatesTo);
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
  
  private switchFromUser: User;
  private switchToUser: User;
  
  setFrom(user: User) {
    this.switchFromUser = user;
    
  }
  
  setTo(user: User) {
    this.switchToUser = user;
  }

  saveSwitch(){
    if(this.switchFromUser == null || this.switchToUser == null){
      this.errorMessage = "To brugere er påkrævet";
      return;
    }
    if(this.switchFromUser == this.switchToUser){
      this.errorMessage = "Ikke tilladt at vælge samme bruger";
      return;
    }
    if(this.weeksBetweenDatesFrom == this.weeksBetweenDatesTo){
      let fromIndex = this.guardDutyUsersFrom.indexOf(this.switchFromUser);
      let toIndex = this.guardDutyUsersFrom.indexOf(this.switchToUser);
      let fromSameteam = (fromIndex == 0 && toIndex == 1) ||(fromIndex == 2 && toIndex == 3);
      if(fromSameteam) {
        this.errorMessage = "Ikke tilladt at vælge fra samme hold";
        return;
      }
    }    
    this.guardDutySwitchService.addGuardDutySwitch(this.weeksBetweenDatesFrom, this.switchFromUser, this.weeksBetweenDatesTo, this.switchToUser, this.scheduleSetup);
    this.switchFromUser = null;
    this.switchToUser = null;
  }

  deleteSwitch(guardDutySwitch: GuardDutySwitch) {
    this.guardDutySwitchService.deleteGuardDutySwitch(guardDutySwitch); 
  }
}
