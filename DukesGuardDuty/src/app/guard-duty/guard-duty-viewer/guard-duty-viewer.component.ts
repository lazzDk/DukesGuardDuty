import { Component, OnInit, OnDestroy } from '@angular/core';

import { ISubscription } from "rxjs/Subscription";

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { DatePickerOptionService } from './../../shared/date-picker-option.service';

import { ScheduleSetup } from './../../schedule-setup/schedule-setup.model';
import { ScheduleSetupService } from './../../schedule-setup/schedule-setup.service';

@Component({
  selector: 'app-guard-duty-viewer',
  templateUrl: './guard-duty-viewer.component.html',
  styleUrls: ['./guard-duty-viewer.component.css']
})
export class GuardDutyViewerComponent implements OnInit, OnDestroy {
  chosenDate:Date;
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

  
  onDateChanged(event: IMyDateModel){
    if(event == null || event.jsdate == null)
      return;
    this.chosenDate =  new Date(event.jsdate); 
  }

}
