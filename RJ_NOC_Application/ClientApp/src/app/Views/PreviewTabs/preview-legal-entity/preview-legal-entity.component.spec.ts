import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewLegalEntityComponent } from './preview-legal-entity.component';

describe('PreviewLegalEntityComponent', () => {
  let component: PreviewLegalEntityComponent;
  let fixture: ComponentFixture<PreviewLegalEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewLegalEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewLegalEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
