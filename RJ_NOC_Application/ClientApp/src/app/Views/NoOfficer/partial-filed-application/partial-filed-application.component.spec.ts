import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialFiledApplicationComponent } from './partial-filed-application.component';

describe('PartialFiledApplicationComponent', () => {
  let component: PartialFiledApplicationComponent;
  let fixture: ComponentFixture<PartialFiledApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartialFiledApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialFiledApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
