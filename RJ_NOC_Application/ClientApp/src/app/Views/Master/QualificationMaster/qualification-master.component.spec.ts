import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationMasterComponent } from './qualification-master.component';

describe('QualificationMasterComponent', () => {
  let component: QualificationMasterComponent;
  let fixture: ComponentFixture<QualificationMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualificationMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualificationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
