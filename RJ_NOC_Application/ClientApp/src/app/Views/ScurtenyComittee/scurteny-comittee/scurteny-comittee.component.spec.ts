import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScurtenyComitteeComponent } from './scurteny-comittee.component';

describe('ScurtenyComitteeComponent', () => {
  let component: ScurtenyComitteeComponent;
  let fixture: ComponentFixture<ScurtenyComitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScurtenyComitteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScurtenyComitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
