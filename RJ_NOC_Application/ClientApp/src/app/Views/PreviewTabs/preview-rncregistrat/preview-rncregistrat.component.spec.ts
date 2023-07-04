import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewRNCRegistratComponent } from './preview-rncregistrat.component';

describe('PreviewRNCRegistratComponent', () => {
  let component: PreviewRNCRegistratComponent;
  let fixture: ComponentFixture<PreviewRNCRegistratComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewRNCRegistratComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewRNCRegistratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
