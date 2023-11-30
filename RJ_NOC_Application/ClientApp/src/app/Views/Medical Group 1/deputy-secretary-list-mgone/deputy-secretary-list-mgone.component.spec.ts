import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeputySecretaryListMGOneComponent } from './deputy-secretary-list-mgone.component';

describe('DeputySecretaryListMGOneComponent', () => {
  let component: DeputySecretaryListMGOneComponent;
  let fixture: ComponentFixture<DeputySecretaryListMGOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeputySecretaryListMGOneComponent]
    });
    fixture = TestBed.createComponent(DeputySecretaryListMGOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
