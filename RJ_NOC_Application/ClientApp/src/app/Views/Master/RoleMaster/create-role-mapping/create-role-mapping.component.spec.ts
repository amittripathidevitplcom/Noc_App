import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoleMappingComponent } from './create-role-mapping.component';

describe('CreateRoleMappingComponent', () => {
  let component: CreateRoleMappingComponent;
  let fixture: ComponentFixture<CreateRoleMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRoleMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoleMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
