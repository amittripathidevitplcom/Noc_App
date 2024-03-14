import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewgrievancereportComponent } from './newgrievancereport.component';

describe('NewgrievancereportComponent', () => {
  let component: NewgrievancereportComponent;
  let fixture: ComponentFixture<NewgrievancereportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewgrievancereportComponent]
    });
    fixture = TestBed.createComponent(NewgrievancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
