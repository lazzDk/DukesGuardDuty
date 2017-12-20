import { Injectable } from '@angular/core';

import { IMyDpOptions, IMyDateModel, IMyOptions } from 'mydatepicker';


@Injectable()
export class DatePickerOptionService {

  constructor() { }

  private myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
    editableDateField: false,
    openSelectorOnInputClick: true,
    inline: false,  
    showWeekNumbers:true,
    todayBtnTxt: "Denne uge",
    dayLabels:{su: 'Søn', mo: 'Man', tu: 'Tirs', we: 'Ons', th: 'Tors', fr: 'Fre', sa: 'Lør'},
    monthLabels: { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'Maj', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dec' },
  }

  getDatePickerOptions(): IMyOptions {
    return this.myDatePickerOptions;
  }


}
