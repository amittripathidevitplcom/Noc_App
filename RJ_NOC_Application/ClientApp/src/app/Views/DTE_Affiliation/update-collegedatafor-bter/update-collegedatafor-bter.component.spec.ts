import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCollegedataforBTERComponent } from './update-collegedatafor-bter.component';

describe('UpdateCollegedataforBTERComponent', () => {
  let component: UpdateCollegedataforBTERComponent;
  let fixture: ComponentFixture<UpdateCollegedataforBTERComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateCollegedataforBTERComponent]
    });
    fixture = TestBed.createComponent(UpdateCollegedataforBTERComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
