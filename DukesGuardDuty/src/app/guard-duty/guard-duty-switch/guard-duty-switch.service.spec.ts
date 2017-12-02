import { TestBed, inject } from '@angular/core/testing';

import { GuardDutySwitchService } from './guard-duty-switch.service';

describe('GuardDutySwitchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuardDutySwitchService]
    });
  });

  it('should be created', inject([GuardDutySwitchService], (service: GuardDutySwitchService) => {
    expect(service).toBeTruthy();
  }));
});
