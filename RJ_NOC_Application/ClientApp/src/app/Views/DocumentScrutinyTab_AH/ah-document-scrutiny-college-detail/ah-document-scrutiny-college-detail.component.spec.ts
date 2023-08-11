import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyCollegeDetailComponent } from './ah-document-scrutiny-college-detail.component';

describe('AhDocumentScrutinyCollegeDetailComponent', () => {
  let component: AhDocumentScrutinyCollegeDetailComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyCollegeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhDocumentScrutinyCollegeDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDocumentScrutinyCollegeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
