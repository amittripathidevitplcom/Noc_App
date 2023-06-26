import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherDocumentComponent } from './other-document.component';

describe('OtherDocumentComponent', () => {
  let component: OtherDocumentComponent;
  let fixture: ComponentFixture<OtherDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
