import { TestBed, inject } from '@angular/core/testing';

import { GuardDutyScheduleCalculatorService } from './guard-duty-schedule-calculator.service';

describe('GuardDutyScheduleCalculatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuardDutyScheduleCalculatorService]
    });
  });

  it('should be created', inject([GuardDutyScheduleCalculatorService], (service: GuardDutyScheduleCalculatorService) => {
    expect(service).toBeTruthy();
  }));
});
