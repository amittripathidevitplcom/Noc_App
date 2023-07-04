import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewScurtenyComitteeComponent } from './preview-scurteny-comittee.component';

describe('PreviewScurtenyComitteeComponent', () => {
  let component: PreviewScurtenyComitteeComponent;
  let fixture: ComponentFixture<PreviewScurtenyComitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewScurtenyComitteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewScurtenyComitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
