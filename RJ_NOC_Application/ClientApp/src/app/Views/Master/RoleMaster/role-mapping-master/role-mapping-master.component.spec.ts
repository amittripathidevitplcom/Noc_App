import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMappingMasterComponent } from './role-mapping-master.component';

describe('RoleMappingMasterComponent', () => {
  let component: RoleMappingMasterComponent;
  let fixture: ComponentFixture<RoleMappingMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleMappingMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMappingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
