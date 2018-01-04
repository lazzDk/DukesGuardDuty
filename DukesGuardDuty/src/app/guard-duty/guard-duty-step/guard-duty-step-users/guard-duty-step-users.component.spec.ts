import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardDutyStepUsersComponent } from './guard-duty-step-users.component';

describe('GuardDutyStepUsersComponent', () => {
  let component: GuardDutyStepUsersComponent;
  let fixture: ComponentFixture<GuardDutyStepUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardDutyStepUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardDutyStepUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
