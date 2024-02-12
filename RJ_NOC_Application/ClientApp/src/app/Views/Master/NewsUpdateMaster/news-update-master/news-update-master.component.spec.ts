import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsUpdateMasterComponent } from './news-update-master.component';

describe('NewsUpdateMasterComponent', () => {
  let component: NewsUpdateMasterComponent;
  let fixture: ComponentFixture<NewsUpdateMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsUpdateMasterComponent]
    });
    fixture = TestBed.createComponent(NewsUpdateMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
