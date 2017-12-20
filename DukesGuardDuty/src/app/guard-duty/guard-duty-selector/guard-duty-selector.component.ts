import { Component, OnInit } from '@angular/core';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { DatePickerOptionService } from './../../shared/date-picker-option.service';

@Component({
  selector: 'app-guard-duty-selector',
  templateUrl: './guard-duty-selector.component.html',
  styleUrls: ['./guard-duty-selector.component.css']
})
export class GuardDutySelectorComponent implements OnInit {
  chosenDates:number[] = [];
  myDatePickerOptions: IMyDpOptions; 

  constructor(private datePickerOptionService: DatePickerOptionService) {
  }

  ngOnInit() {
    this.myDatePickerOptions = this.datePickerOptionService.getDatePickerOptions();
  }

  onFromDateChanged(event: IMyDateModel){
    if(event == null || event.jsdate == null){
      return;
    } 
    let startDate = new Date(event.jsdate); 
    let endDate = new Date(event.jsdate);
    endDate.setFullYear(startDate.getFullYear() + 1);
   /* this.chosenDates = [1512946800000,1514156400000,1515366000000,1516575600000,1517785200000,1518994800000,1520204400000,1521414000000]; */
    this.chosenDates = [1517785200000,1518994800000,1520204400000,1521414000000];
    
    /*while(startDate.getTime() < endDate.getTime()) {
      this.chosenDates.push(startDate.getTime()); 
      let addedTwoWeeksTime = startDate.getTime() + (1000 * 60 * 60 * 24 * 14);
      startDate.setTime(addedTwoWeeksTime);
    }*/
  }

}
