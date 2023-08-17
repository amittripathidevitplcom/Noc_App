import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNocpreviewAgricultureComponent } from './apply-nocpreview-agriculture.component';

describe('ApplyNocpreviewAgricultureComponent', () => {
  let component: ApplyNocpreviewAgricultureComponent;
  let fixture: ComponentFixture<ApplyNocpreviewAgricultureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyNocpreviewAgricultureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNocpreviewAgricultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
