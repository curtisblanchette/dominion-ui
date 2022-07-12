import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowAppointmentComponent } from './appointment.component';

describe('AppointmentComponent', () => {
  let component: FlowAppointmentComponent;
  let fixture: ComponentFixture<FlowAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
