import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MG1DocumentScrutinyLandDetailComponent } from './mg1-document-scrutiny-land-detail.component';

describe('MG1DocumentScrutinyLandDetailComponent', () => {
  let component: MG1DocumentScrutinyLandDetailComponent;
  let fixture: ComponentFixture<MG1DocumentScrutinyLandDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MG1DocumentScrutinyLandDetailComponent]
    });
    fixture = TestBed.createComponent(MG1DocumentScrutinyLandDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
