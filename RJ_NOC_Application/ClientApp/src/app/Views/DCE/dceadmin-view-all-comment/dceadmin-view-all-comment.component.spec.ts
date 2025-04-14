import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DCEAdminViewAllCommentComponent } from './dceadmin-view-all-comment.component';

describe('DCEAdminViewAllCommentComponent', () => {
  let component: DCEAdminViewAllCommentComponent;
  let fixture: ComponentFixture<DCEAdminViewAllCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DCEAdminViewAllCommentComponent]
    });
    fixture = TestBed.createComponent(DCEAdminViewAllCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
