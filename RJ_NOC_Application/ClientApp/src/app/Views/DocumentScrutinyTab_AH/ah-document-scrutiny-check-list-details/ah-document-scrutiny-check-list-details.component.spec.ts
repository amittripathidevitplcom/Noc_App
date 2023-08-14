import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyCheckListDetailsComponent } from './ah-document-scrutiny-check-list-details.component';

describe('AhDocumentScrutinyCheckListDetailsComponent', () => {
  let component: AhDocumentScrutinyCheckListDetailsComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyCheckListDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhDocumentScrutinyCheckListDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDocumentScrutinyCheckListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
