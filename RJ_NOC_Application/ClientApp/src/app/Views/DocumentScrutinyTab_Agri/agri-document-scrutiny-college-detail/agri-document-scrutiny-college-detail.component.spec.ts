import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDocumentScrutinyCollegeDetailComponent } from './agri-document-scrutiny-college-detail.component';

describe('AgriDocumentScrutinyCollegeDetailComponent', () => {
  let component: AgriDocumentScrutinyCollegeDetailComponent;
  let fixture: ComponentFixture<AgriDocumentScrutinyCollegeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriDocumentScrutinyCollegeDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriDocumentScrutinyCollegeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
