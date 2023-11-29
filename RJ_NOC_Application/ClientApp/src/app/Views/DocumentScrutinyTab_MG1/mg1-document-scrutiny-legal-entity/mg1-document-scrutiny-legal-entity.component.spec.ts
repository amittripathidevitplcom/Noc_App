import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MG1DocumentScrutinyLegalEntityComponent } from './mg1-document-scrutiny-legal-entity.component';

describe('MG1DocumentScrutinyLegalEntityComponent', () => {
  let component: MG1DocumentScrutinyLegalEntityComponent;
  let fixture: ComponentFixture<MG1DocumentScrutinyLegalEntityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MG1DocumentScrutinyLegalEntityComponent]
    });
    fixture = TestBed.createComponent(MG1DocumentScrutinyLegalEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
