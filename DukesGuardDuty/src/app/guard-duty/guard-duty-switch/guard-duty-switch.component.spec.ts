import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardDutySwitchComponent } from './guard-duty-switch.component';

describe('GuardDutySwitchComponent', () => {
  let component: GuardDutySwitchComponent;
  let fixture: ComponentFixture<GuardDutySwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardDutySwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardDutySwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
