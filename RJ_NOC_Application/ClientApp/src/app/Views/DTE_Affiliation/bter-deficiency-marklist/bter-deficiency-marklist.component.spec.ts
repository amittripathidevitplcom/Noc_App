import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterDeficiencyMarklistComponent } from './bter-deficiency-marklist.component';

describe('BterDeficiencyMarklistComponent', () => {
  let component: BterDeficiencyMarklistComponent;
  let fixture: ComponentFixture<BterDeficiencyMarklistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BterDeficiencyMarklistComponent]
    });
    fixture = TestBed.createComponent(BterDeficiencyMarklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
