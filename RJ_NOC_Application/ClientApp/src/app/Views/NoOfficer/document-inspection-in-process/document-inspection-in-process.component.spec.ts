import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentInspectionInProcessComponent } from './document-inspection-in-process.component';

describe('DocumentInspectionInProcessComponent', () => {
  let component: DocumentInspectionInProcessComponent;
  let fixture: ComponentFixture<DocumentInspectionInProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentInspectionInProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentInspectionInProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
