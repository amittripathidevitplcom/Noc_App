import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodalSecretaryApplicationListMGOneComponent } from './nodal-secretary-application-list-mgone.component';

describe('NodalSecretaryApplicationListMGOneComponent', () => {
  let component: NodalSecretaryApplicationListMGOneComponent;
  let fixture: ComponentFixture<NodalSecretaryApplicationListMGOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodalSecretaryApplicationListMGOneComponent]
    });
    fixture = TestBed.createComponent(NodalSecretaryApplicationListMGOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
