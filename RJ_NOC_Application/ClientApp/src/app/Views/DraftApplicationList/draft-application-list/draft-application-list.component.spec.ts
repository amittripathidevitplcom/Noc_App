import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftApplicationListComponent } from './draft-application-list.component';

describe('DraftApplicationListComponent', () => {
  let component: DraftApplicationListComponent;
  let fixture: ComponentFixture<DraftApplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DraftApplicationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
