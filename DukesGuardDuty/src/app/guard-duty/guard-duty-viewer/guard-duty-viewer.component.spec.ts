import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardDutyViewerComponent } from './guard-duty-viewer.component';

describe('GuardDutyViewerComponent', () => {
  let component: GuardDutyViewerComponent;
  let fixture: ComponentFixture<GuardDutyViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardDutyViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardDutyViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
