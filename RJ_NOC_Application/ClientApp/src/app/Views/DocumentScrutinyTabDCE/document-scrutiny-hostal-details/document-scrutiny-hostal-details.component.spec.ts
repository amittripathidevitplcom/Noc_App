import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyHostalDetailsComponent } from './document-scrutiny-hostal-details.component';

describe('DocumentScrutinyHostalDetailsComponent', () => {
  let component: DocumentScrutinyHostalDetailsComponent;
  let fixture: ComponentFixture<DocumentScrutinyHostalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyHostalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyHostalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
