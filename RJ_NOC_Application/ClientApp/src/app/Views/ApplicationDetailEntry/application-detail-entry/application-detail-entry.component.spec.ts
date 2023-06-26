import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDetailEntryComponent } from './application-detail-entry.component';

describe('ApplicationDetailEntryComponent', () => {
  let component: ApplicationDetailEntryComponent;
  let fixture: ComponentFixture<ApplicationDetailEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationDetailEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDetailEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
