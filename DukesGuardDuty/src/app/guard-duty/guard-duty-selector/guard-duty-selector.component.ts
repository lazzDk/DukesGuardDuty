import { Component, OnInit, OnDestroy } from '@angular/core';

import { ISubscription } from "rxjs/Subscription";

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { DatePickerOptionService } from './../../shared/date-picker-option.service';

import { ScheduleSetup } from './../../schedule-setup/schedule-setup.model';
import { ScheduleSetupService } from './../../schedule-setup/schedule-setup.service';

@Component({
  selector: 'app-guard-duty-selector',
  templateUrl: './guard-duty-selector.component.html',
  styleUrls: ['./guard-duty-selector.component.css']
})
export class GuardDutySelectorComponent implements OnInit, OnDestroy {
  chosenDates:number[] = [];
  myDatePickerOptions: IMyDpOptions;   
  scheduleSetup: ScheduleSetup;
  
  private scheduleSetupSubscription: ISubscription;
  
  constructor(
    private datePickerOptionService: DatePickerOptionService,
    private scheduleSetupService: ScheduleSetupService) {
  }

  ngOnInit() {
    this.myDatePickerOptions = this.datePickerOptionService.getDatePickerOptions();
    this.scheduleSetupSubscription = this.scheduleSetupService.getScheduleSetups().subscribe(setups => {
      this.scheduleSetup = setups != null && setups.length > 0 ? setups[0] : null;
    });
  }

  ngOnDestroy(){
    if(this.scheduleSetupSubscription != null)
      this.scheduleSetupSubscription.unsubscribe();
  }

  onFromDateChanged(event: IMyDateModel){
    if(event == null || event.jsdate == null){
      return;
    } 
    let startDate = new Date(event.jsdate); 
    let endDate = new Date(event.jsdate);
    endDate.setFullYear(startDate.getFullYear() + 1);
    this.chosenDates=[];
    while(startDate.getTime() <= endDate.getTime()) {
      this.chosenDates.push(startDate.getTime()); 
      let addedTwoWeeksTime = startDate.getTime() + (1000 * 60 * 60 * 24 * 14);
      startDate.setTime(addedTwoWeeksTime);
    }
  }

}
