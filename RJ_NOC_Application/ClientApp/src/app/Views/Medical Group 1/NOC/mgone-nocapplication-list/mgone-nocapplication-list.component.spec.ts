import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MgoneNocapplicationListComponent } from './mgone-nocapplication-list.component';

describe('MgoneNocapplicationListComponent', () => {
  let component: MgoneNocapplicationListComponent;
  let fixture: ComponentFixture<MgoneNocapplicationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MgoneNocapplicationListComponent]
    });
    fixture = TestBed.createComponent(MgoneNocapplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
