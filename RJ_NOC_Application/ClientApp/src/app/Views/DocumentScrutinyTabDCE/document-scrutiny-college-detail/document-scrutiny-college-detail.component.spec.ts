import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyCollegeDetailComponent } from './document-scrutiny-college-detail.component';

describe('DocumentScrutinyCollegeDetailComponent', () => {
  let component: DocumentScrutinyCollegeDetailComponent;
  let fixture: ComponentFixture<DocumentScrutinyCollegeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyCollegeDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyCollegeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
