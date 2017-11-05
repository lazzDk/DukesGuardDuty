import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardDutyComponent } from './guard-duty.component';

describe('GuardDutyComponent', () => {
  let component: GuardDutyComponent;
  let fixture: ComponentFixture<GuardDutyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardDutyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardDutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
