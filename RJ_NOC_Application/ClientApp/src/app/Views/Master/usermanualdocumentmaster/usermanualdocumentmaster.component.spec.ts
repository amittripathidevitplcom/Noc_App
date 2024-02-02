import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermanualdocumentmasterComponent } from './usermanualdocumentmaster.component';

describe('UsermanualdocumentmasterComponent', () => {
  let component: UsermanualdocumentmasterComponent;
  let fixture: ComponentFixture<UsermanualdocumentmasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsermanualdocumentmasterComponent]
    });
    fixture = TestBed.createComponent(UsermanualdocumentmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
