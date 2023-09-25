import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LOIApplicationListComponent } from './loiapplication-list.component';

describe('LOIApplicationListComponent', () => {
  let component: LOIApplicationListComponent;
  let fixture: ComponentFixture<LOIApplicationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LOIApplicationListComponent]
    });
    fixture = TestBed.createComponent(LOIApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
