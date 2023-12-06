import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalEntityRevertComponent } from './legal-entity-revert.component';

describe('LegalEntityRevertComponent', () => {
  let component: LegalEntityRevertComponent;
  let fixture: ComponentFixture<LegalEntityRevertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LegalEntityRevertComponent]
    });
    fixture = TestBed.createComponent(LegalEntityRevertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
