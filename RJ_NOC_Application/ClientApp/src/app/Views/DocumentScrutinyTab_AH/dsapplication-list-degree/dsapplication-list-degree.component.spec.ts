import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DSApplicationListDegreeComponent } from './dsapplication-list-degree.component';

describe('DSApplicationListDegreeComponent', () => {
  let component: DSApplicationListDegreeComponent;
  let fixture: ComponentFixture<DSApplicationListDegreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DSApplicationListDegreeComponent]
    });
    fixture = TestBed.createComponent(DSApplicationListDegreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
