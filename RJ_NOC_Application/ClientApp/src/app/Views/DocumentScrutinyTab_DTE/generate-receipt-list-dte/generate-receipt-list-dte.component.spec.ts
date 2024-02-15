import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateReceiptListDTEComponent } from './generate-receipt-list-dte.component';

describe('GenerateReceiptListDTEComponent', () => {
  let component: GenerateReceiptListDTEComponent;
  let fixture: ComponentFixture<GenerateReceiptListDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateReceiptListDTEComponent]
    });
    fixture = TestBed.createComponent(GenerateReceiptListDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
