import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MG1DocumentScrutinyCMSComponent } from './mg1-document-scrutiny-cms.component';

describe('MG1DocumentScrutinyCMSComponent', () => {
  let component: MG1DocumentScrutinyCMSComponent;
  let fixture: ComponentFixture<MG1DocumentScrutinyCMSComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MG1DocumentScrutinyCMSComponent]
    });
    fixture = TestBed.createComponent(MG1DocumentScrutinyCMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
