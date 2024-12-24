import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMGOneInfrastructureComponent } from './preview-mgone-infrastructure.component';

describe('PreviewMGOneInfrastructureComponent', () => {
  let component: PreviewMGOneInfrastructureComponent;
  let fixture: ComponentFixture<PreviewMGOneInfrastructureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewMGOneInfrastructureComponent]
    });
    fixture = TestBed.createComponent(PreviewMGOneInfrastructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
