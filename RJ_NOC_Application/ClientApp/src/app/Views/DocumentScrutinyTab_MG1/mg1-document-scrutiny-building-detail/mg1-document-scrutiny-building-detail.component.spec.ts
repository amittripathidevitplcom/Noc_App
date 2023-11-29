import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MG1DocumentScrutinyBuildingDetailComponent } from './mg1-document-scrutiny-building-detail.component';

describe('MG1DocumentScrutinyBuildingDetailComponent', () => {
  let component: MG1DocumentScrutinyBuildingDetailComponent;
  let fixture: ComponentFixture<MG1DocumentScrutinyBuildingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MG1DocumentScrutinyBuildingDetailComponent]
    });
    fixture = TestBed.createComponent(MG1DocumentScrutinyBuildingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
