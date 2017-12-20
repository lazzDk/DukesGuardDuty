import { Injectable } from '@angular/core';
import { User } from './../user/user.model'

@Injectable()
export class GuardDutyScheduleCalculatorService {

  constructor() { }

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

  getWeeksBetweenDates(startDate: Date, endDate: Date) {
    console.log(endDate);
    var WEEK = 1000 * 60 * 60 * 24 * 7;
    startDate.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);
    var startDateMs = startDate.getTime();
    var endDateMs = endDate.getTime();
    var differenceInMs = Math.abs(endDateMs - startDateMs);
    return Math.floor(differenceInMs / WEEK);
  } 

  isWeekForSwitchingDay(weeksForIteration:number):boolean{
    return weeksForIteration === 2 || (weeksForIteration > 1 && weeksForIteration % 4 == 2);
  };

  isEvenWeek(weekNumber: number):boolean {
    return weekNumber % 2 == 0;
  }  

  swapItems(array: any, outsiderSwitchIndex:number, outsiderIndex:number) {
    if(array == null || outsiderSwitchIndex < 0 || outsiderSwitchIndex >= array.length || outsiderIndex < 0 || outsiderIndex >= array.length)
     return;
    var temp = array[outsiderSwitchIndex];
    array[outsiderSwitchIndex] = array[outsiderIndex];
    array[outsiderIndex] = temp; 
  }

  switchTeamsForNRounds(users: User[], nRounds:number) {
    let outSiderIndex = 8;
    let timeToSwitch = 0;
    for(let rounds = 0; rounds < nRounds; rounds++) {
      this.swapItems(users, timeToSwitch, outSiderIndex);
      timeToSwitch = timeToSwitch == outSiderIndex - 1 ? 0 : timeToSwitch + 1;
    }
  }
 
  switchDayForTeams(array: any,index:number) {
    var temp0 = array[index];
    var temp1 = array[index+1];

    array[index] = array[index+2];
    array[index+1] = array[index+3];

    array[index+2] = temp0;
    array[index+3] = temp1;
  } 
}
