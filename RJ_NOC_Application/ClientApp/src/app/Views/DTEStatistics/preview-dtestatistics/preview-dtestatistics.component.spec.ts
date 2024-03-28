import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDTEStatisticsComponent } from './preview-dtestatistics.component';

describe('PreviewDTEStatisticsComponent', () => {
  let component: PreviewDTEStatisticsComponent;
  let fixture: ComponentFixture<PreviewDTEStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewDTEStatisticsComponent]
    });
    fixture = TestBed.createComponent(PreviewDTEStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
