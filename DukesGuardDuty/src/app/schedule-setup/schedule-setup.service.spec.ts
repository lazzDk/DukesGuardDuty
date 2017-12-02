import { TestBed, inject } from '@angular/core/testing';

import { ScheduleSetupService } from './schedule-setup.service';

describe('ScheduleSetupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScheduleSetupService]
    });
  });

  it('should be created', inject([ScheduleSetupService], (service: ScheduleSetupService) => {
    expect(service).toBeTruthy();
  }));
});
