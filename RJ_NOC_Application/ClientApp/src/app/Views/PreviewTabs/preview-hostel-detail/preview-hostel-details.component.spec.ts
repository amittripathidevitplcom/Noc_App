import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewHostelDetailsComponent } from './preview-hostel-details.component';

describe('PreviewHostelDetailsComponent', () => {
  let component: PreviewHostelDetailsComponent;
  let fixture: ComponentFixture<PreviewHostelDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewHostelDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewHostelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
