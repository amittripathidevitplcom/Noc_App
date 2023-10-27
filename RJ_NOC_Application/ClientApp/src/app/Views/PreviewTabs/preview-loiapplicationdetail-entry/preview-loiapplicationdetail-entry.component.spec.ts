import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewLOIapplicationdetailEntryComponent } from './preview-loiapplicationdetail-entry.component';

describe('PreviewLOIapplicationdetailEntryComponent', () => {
  let component: PreviewLOIapplicationdetailEntryComponent;
  let fixture: ComponentFixture<PreviewLOIapplicationdetailEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewLOIapplicationdetailEntryComponent]
    });
    fixture = TestBed.createComponent(PreviewLOIapplicationdetailEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
