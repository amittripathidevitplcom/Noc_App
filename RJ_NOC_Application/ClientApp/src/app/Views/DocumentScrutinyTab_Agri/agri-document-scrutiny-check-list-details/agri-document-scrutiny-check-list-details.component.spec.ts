import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDocumentScrutinyCheckListDetailsComponent } from './agri-document-scrutiny-check-list-details.component';

describe('AgriDocumentScrutinyCheckListDetailsComponent', () => {
  let component: AgriDocumentScrutinyCheckListDetailsComponent;
  let fixture: ComponentFixture<AgriDocumentScrutinyCheckListDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriDocumentScrutinyCheckListDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriDocumentScrutinyCheckListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
