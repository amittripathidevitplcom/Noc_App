import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardByMinisterListMGOneComponent } from './forward-by-minister-list-mgone.component';

describe('ForwardByMinisterListMGOneComponent', () => {
  let component: ForwardByMinisterListMGOneComponent;
  let fixture: ComponentFixture<ForwardByMinisterListMGOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForwardByMinisterListMGOneComponent]
    });
    fixture = TestBed.createComponent(ForwardByMinisterListMGOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
