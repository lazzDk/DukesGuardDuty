import { Component, OnInit } from '@angular/core';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { DatePickerOptionService } from './../../shared/date-picker-option.service';

@Component({
  selector: 'app-guard-duty-viewer',
  templateUrl: './guard-duty-viewer.component.html',
  styleUrls: ['./guard-duty-viewer.component.css']
})
export class GuardDutyViewerComponent implements OnInit {
  chosenDate:Date;
  myDatePickerOptions: IMyDpOptions; 
  
  constructor(private datePickerOptionService: DatePickerOptionService) {
  }
  

  ngOnInit() {
    this.myDatePickerOptions = this.datePickerOptionService.getDatePickerOptions();
  }

  
  onDateChanged(event: IMyDateModel){
    if(event == null || event.jsdate == null)
      return;
    this.chosenDate =  new Date(event.jsdate); 
  }

}
