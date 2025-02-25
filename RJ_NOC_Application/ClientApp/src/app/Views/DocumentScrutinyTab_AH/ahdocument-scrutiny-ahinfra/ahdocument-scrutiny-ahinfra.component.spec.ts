import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AHDocumentScrutinyAHInfraComponent } from './ahdocument-scrutiny-ahinfra.component';

describe('AHDocumentScrutinyAHInfraComponent', () => {
  let component: AHDocumentScrutinyAHInfraComponent;
  let fixture: ComponentFixture<AHDocumentScrutinyAHInfraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AHDocumentScrutinyAHInfraComponent]
    });
    fixture = TestBed.createComponent(AHDocumentScrutinyAHInfraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
