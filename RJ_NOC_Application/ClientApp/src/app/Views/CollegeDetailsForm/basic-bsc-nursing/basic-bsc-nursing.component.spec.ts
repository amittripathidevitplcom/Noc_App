import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicBscNursingComponent } from './basic-bsc-nursing.component';

describe('BasicBscNursingComponent', () => {
  let component: BasicBscNursingComponent;
  let fixture: ComponentFixture<BasicBscNursingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicBscNursingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicBscNursingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
