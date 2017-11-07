import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSetupComponent } from './schedule-setup.component';

describe('ScheduleSetupComponent', () => {
  let component: ScheduleSetupComponent;
  let fixture: ComponentFixture<ScheduleSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
