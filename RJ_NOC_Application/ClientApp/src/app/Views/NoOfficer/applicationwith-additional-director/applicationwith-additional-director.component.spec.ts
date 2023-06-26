import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationwithAdditionalDirectorComponent } from './applicationwith-additional-director.component';

describe('ApplicationwithAdditionalDirectorComponent', () => {
  let component: ApplicationwithAdditionalDirectorComponent;
  let fixture: ComponentFixture<ApplicationwithAdditionalDirectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationwithAdditionalDirectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationwithAdditionalDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
