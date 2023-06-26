import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeficiencyMarkedComponent } from './deficiency-marked.component';

describe('DeficiencyMarkedComponent', () => {
  let component: DeficiencyMarkedComponent;
  let fixture: ComponentFixture<DeficiencyMarkedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeficiencyMarkedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeficiencyMarkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
