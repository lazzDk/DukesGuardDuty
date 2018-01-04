import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardDutyStepComponent } from './guard-duty-step.component';

describe('GuardDutyComponent', () => {
  let component: GuardDutyStepComponent;
  let fixture: ComponentFixture<GuardDutyStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardDutyStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardDutyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
