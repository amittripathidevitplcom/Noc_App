import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNocFeesComponent } from './update-noc-fees.component';

describe('UpdateNocFeesComponent', () => {
  let component: UpdateNocFeesComponent;
  let fixture: ComponentFixture<UpdateNocFeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateNocFeesComponent]
    });
    fixture = TestBed.createComponent(UpdateNocFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
