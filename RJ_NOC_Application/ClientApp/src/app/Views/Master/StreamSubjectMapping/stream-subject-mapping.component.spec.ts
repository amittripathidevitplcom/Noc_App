import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamSubjectMappingComponent } from './stream-subject-mapping.component';

describe('StreamMasterComponent', () => {
  let component: StreamSubjectMappingComponent;
  let fixture: ComponentFixture<StreamSubjectMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StreamSubjectMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamSubjectMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
