import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyAreaMasterComponent } from './assembly-area-master.component';

describe('AssemblyAreaMasterComponent', () => {
  let component: AssemblyAreaMasterComponent;
  let fixture: ComponentFixture<AssemblyAreaMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssemblyAreaMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyAreaMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
