import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoleMasterComponent } from './add-role-master.component';

describe('AddRoleMasterComponent', () => {
  let component: AddRoleMasterComponent;
  let fixture: ComponentFixture<AddRoleMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRoleMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoleMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
