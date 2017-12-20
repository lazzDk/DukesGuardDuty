import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardDutySelectorComponent } from './guard-duty-selector.component';

describe('GuardDutySelectorComponent', () => {
  let component: GuardDutySelectorComponent;
  let fixture: ComponentFixture<GuardDutySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardDutySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardDutySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
