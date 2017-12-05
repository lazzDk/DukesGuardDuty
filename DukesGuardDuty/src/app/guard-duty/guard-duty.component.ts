import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ISubscription } from "rxjs/Subscription";

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

import { GuardDutySwitch } from './guard-duty-switch/guard-duty-switch.model';
import { GuardDutySwitchService } from './guard-duty-switch/guard-duty-switch.service';
import { GuardDutyScheduleCalculatorService } from './guard-duty-schedule-calculator.service';

import { ScheduleSetup } from './../schedule-setup/schedule-setup.model';
import { ScheduleSetupService } from './../schedule-setup/schedule-setup.service';
import { User } from './../user/user.model';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-guard-duty',
  templateUrl: './guard-duty.component.html',
  styleUrls: ['./guard-duty.component.css']
})

export class GuardDutyComponent implements OnInit, OnDestroy {
  scheduleSetup: ScheduleSetup;
  startWeek:number = 0;
  maxWeeksInStartYear: number = 52;  
  guardDutyUsers: User[];
  guardDutySwitches: GuardDutySwitch[];
  weeksBetweenDates: number = 0;
  
  private scheduleSetupSubscription: ISubscription;
  private guardDutySubscription: ISubscription;

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
    editableDateField: false,
    openSelectorOnInputClick: true,
    inline: false,  
    showWeekNumbers:true,
    todayBtnTxt: "Denne uge",
    dayLabels:{su: 'Søn', mo: 'Man', tu: 'Tirs', we: 'Ons', th: 'Tors', fr: 'Fre', sa: 'Lør'},
    monthLabels: { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'Maj', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dec' },
  }

  constructor(
    private scheduleSetupService: ScheduleSetupService, 
    private guardDutySwitchService: GuardDutySwitchService, 
    private scheduleCalculator: GuardDutyScheduleCalculatorService) {
   }

  ngOnInit() {
    this.guardDutySubscription =  this.guardDutySwitchService.getGuardDutySwitches().subscribe(switches => {
      this.guardDutySwitches = switches;
    });
    this.scheduleSetupSubscription = this.scheduleSetupService.getScheduleSetups().subscribe(setups => {
      this.scheduleSetup = setups != null && setups.length > 0 ? setups[0] : null;
      if(this.scheduleSetup != null){
        this.setStartDateInfo();
        this.setScheduleForCurrentWeek();
      }
    });
  }

  ngOnDestroy(){
    if(this.guardDutySubscription != null)
      this.guardDutySubscription.unsubscribe ();
    if(this.scheduleSetupSubscription != null)
      this.scheduleSetupSubscription.unsubscribe();
  }

  setScheduleForCurrentWeek(){
    let today = new Date();
    this.scheduleCalculator.resetDate(today);
    this.weeksBetweenDates = this.scheduleCalculator.getWeeksBetweenDates(new Date(this.scheduleSetup.startDate), today);
    this.calculateTeams();
  }

  getWeekNumberViewFriendly(week:number){
    let maxWeeks = this.startWeek + this.weeksBetweenDates + week;
    return maxWeeks > this.maxWeeksInStartYear ? maxWeeks - this.maxWeeksInStartYear : maxWeeks;
  }

  setStartDateInfo() {
    let date = new Date(this.scheduleSetup.startDate);
    var onejan = new Date(date.getFullYear(), 0, 1);
    this.startWeek = Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    this.maxWeeksInStartYear = this.scheduleCalculator.getWeeksInYear(date.getFullYear());
  }

  swapItems(array: any, outsiderSwitchIndex:number, outsiderIndex:number) {
    if(array == null || outsiderSwitchIndex < 0 || outsiderSwitchIndex >= array.length || outsiderIndex < 0 || outsiderIndex >= array.length)
     return;
    var temp = array[outsiderSwitchIndex];
    array[outsiderSwitchIndex] = array[outsiderIndex];
    array[outsiderIndex] = temp; 
  }
 
  composeUnevenWeekTeam(previousWeekUsers: User[], currenWeekUsers: User[]): User[]{
    return previousWeekUsers.slice(4, 8).concat(currenWeekUsers.slice(0,4).concat(currenWeekUsers.slice(8, 9)));
  }

  getDefaultScheduleSetupUserArray():User[]{
    return this.scheduleSetup.users.slice();
  }

  calculateTeams() {
    if(this.scheduleCalculator.isEvenWeek(this.weeksBetweenDates)) {
      this.guardDutyUsers = this.getDefaultScheduleSetupUserArray();
      this.scheduleCalculator.switchTeamsForNRounds(this.guardDutyUsers, this.weeksBetweenDates);
      if(this.scheduleCalculator.isWeekForSwitchingDay(this.weeksBetweenDates)) {
        this.scheduleCalculator.switchDayForTeams(this.guardDutyUsers, 0);
        this.scheduleCalculator.switchDayForTeams(this.guardDutyUsers, 4);
      }
    }
    else {
      let previousIterationUsers = this.getDefaultScheduleSetupUserArray();
      this.scheduleCalculator.switchTeamsForNRounds(previousIterationUsers, this.weeksBetweenDates- 1);
      let previousIterationWeek = this.weeksBetweenDates - 1;
      if(this.scheduleCalculator.isWeekForSwitchingDay(previousIterationWeek)) {
        this.scheduleCalculator.switchDayForTeams(previousIterationUsers, 4);
      }
     
      let currentIterationUsers = this.getDefaultScheduleSetupUserArray();
      this.scheduleCalculator.switchTeamsForNRounds(currentIterationUsers, this.weeksBetweenDates);
      let nextIterationWeek = this.weeksBetweenDates + 1;
      if(this.scheduleCalculator.isWeekForSwitchingDay(nextIterationWeek)) {
        this.scheduleCalculator.switchDayForTeams(currentIterationUsers, 0);
      }
      this.guardDutyUsers = this.composeUnevenWeekTeam(previousIterationUsers, currentIterationUsers);

    }
    this.handleDutySwitches();
  }

  swapUsers(fromUser: User, toUser:User) {
    let index = this.guardDutyUsers.findIndex(user => user.id == fromUser.id);
    if(index != -1) {
      this.guardDutyUsers[index] = toUser;
    } 
  }

  switchUsers(fromUser: User, toUser:User) {
    let indexFrom = this.guardDutyUsers.findIndex(user => user.id == fromUser.id);
    let indexTo = this.guardDutyUsers.findIndex(user => user.id == toUser.id);
    if(indexFrom != -1 && indexTo != -1) {
      this.guardDutyUsers[indexFrom] = toUser;
      this.guardDutyUsers[indexTo] = fromUser;
    } 
  }

  handleDutySwitches() {
    if(this.guardDutySwitches != null && this.guardDutySwitches.length > 0) {
      let switchesFromCurrentWeek = this.guardDutySwitches.filter(dutySwitch => dutySwitch.fromWeek == this.weeksBetweenDates);
      let switchesFromNextWeek = this.guardDutySwitches.filter(dutySwitch => dutySwitch.fromWeek == (this.weeksBetweenDates + 1));
    
      let switchesToThisWeek = this.guardDutySwitches.filter(dutySwitch => dutySwitch.toWeek == this.weeksBetweenDates);
      let switchesToNextWeek = this.guardDutySwitches.filter(dutySwitch => dutySwitch.toWeek == (this.weeksBetweenDates + 1));

      switchesFromCurrentWeek.forEach(dutySwitch => {
        if(dutySwitch.toWeek == (this.weeksBetweenDates +1))
        {
          this.switchUsers(dutySwitch.fromUser, dutySwitch.toUser);
        }
        else {
          this.swapUsers(dutySwitch.fromUser, dutySwitch.toUser);
        }
      });
      
      switchesToNextWeek.forEach(dutySwitch => {
       if(dutySwitch.toWeek != (this.weeksBetweenDates +1))
        this.swapUsers(dutySwitch.toUser, dutySwitch.fromUser);
      });

      switchesFromNextWeek.forEach(dutySwitch => {
        this.swapUsers(dutySwitch.fromUser, dutySwitch.toUser);
      });

      switchesToThisWeek.forEach(dutySwitch => {
        this.swapUsers(dutySwitch.toUser, dutySwitch.fromUser);
      });
    }
  }


  onDateChanged(event: IMyDateModel){
    console.log("date changed");
    if(event == null || event.jsdate == null)
      return;
    this.weeksBetweenDates = this.scheduleCalculator.getWeeksBetweenDates(new Date(this.scheduleSetup.startDate), new Date(event.jsdate));
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
