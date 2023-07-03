import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalLegalEntityPreviewComponent } from './total-legal-entity-preview.component';

describe('TotalLegalEntityPreviewComponent', () => {
  let component: TotalLegalEntityPreviewComponent;
  let fixture: ComponentFixture<TotalLegalEntityPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalLegalEntityPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalLegalEntityPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
