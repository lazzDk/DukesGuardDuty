import { TestBed, inject } from '@angular/core/testing';

import { DatePickerOptionService } from './date-picker-option.service';

describe('DatePickerOptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePickerOptionService]
    });
  });

  it('should be created', inject([DatePickerOptionService], (service: DatePickerOptionService) => {
    expect(service).toBeTruthy();
  }));
});
