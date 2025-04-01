import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyforbterotherinfoComponent } from './document-scrutinyforbterotherinfo.component';

describe('DocumentScrutinyforbterotherinfoComponent', () => {
  let component: DocumentScrutinyforbterotherinfoComponent;
  let fixture: ComponentFixture<DocumentScrutinyforbterotherinfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyforbterotherinfoComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyforbterotherinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
