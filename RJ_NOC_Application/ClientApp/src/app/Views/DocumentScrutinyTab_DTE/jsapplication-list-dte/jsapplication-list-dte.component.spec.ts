import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JSApplicationListDTEComponent } from './jsapplication-list-dte.component';

describe('JSApplicationListDTEComponent', () => {
  let component: JSApplicationListDTEComponent;
  let fixture: ComponentFixture<JSApplicationListDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JSApplicationListDTEComponent]
    });
    fixture = TestBed.createComponent(JSApplicationListDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
