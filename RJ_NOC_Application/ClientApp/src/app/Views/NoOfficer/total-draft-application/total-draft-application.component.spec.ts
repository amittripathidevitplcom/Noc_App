import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalDraftApplicationComponent } from './total-draft-application.component';

describe('TotalDraftApplicationComponent', () => {
  let component: TotalDraftApplicationComponent;
  let fixture: ComponentFixture<TotalDraftApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalDraftApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalDraftApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
