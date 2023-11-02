import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NocInformationComponent } from './noc-information.component';

describe('NocInformationComponent', () => {
  let component: NocInformationComponent;
  let fixture: ComponentFixture<NocInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NocInformationComponent]
    });
    fixture = TestBed.createComponent(NocInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
