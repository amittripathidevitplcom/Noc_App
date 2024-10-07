import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoccheckListMgoneComponent } from './noccheck-list-mgone.component';

describe('NoccheckListMgoneComponent', () => {
  let component: NoccheckListMgoneComponent;
  let fixture: ComponentFixture<NoccheckListMgoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoccheckListMgoneComponent]
    });
    fixture = TestBed.createComponent(NoccheckListMgoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
