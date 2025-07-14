import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERAdminUpdateComponent } from './bteradmin-update.component';

describe('BTERAdminUpdateComponent', () => {
  let component: BTERAdminUpdateComponent;
  let fixture: ComponentFixture<BTERAdminUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERAdminUpdateComponent]
    });
    fixture = TestBed.createComponent(BTERAdminUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
