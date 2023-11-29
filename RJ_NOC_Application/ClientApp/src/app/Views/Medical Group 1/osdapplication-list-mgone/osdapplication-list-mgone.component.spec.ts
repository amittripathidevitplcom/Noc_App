import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OSDApplicationListMGOneComponent } from './osdapplication-list-mgone.component';

describe('OSDApplicationListMGOneComponent', () => {
  let component: OSDApplicationListMGOneComponent;
  let fixture: ComponentFixture<OSDApplicationListMGOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OSDApplicationListMGOneComponent]
    });
    fixture = TestBed.createComponent(OSDApplicationListMGOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
