import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RNCCheckListMasterComponent } from './rnccheck-list-master.component';

describe('RNCCheckListMasterComponent', () => {
  let component: RNCCheckListMasterComponent;
  let fixture: ComponentFixture<RNCCheckListMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RNCCheckListMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RNCCheckListMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
