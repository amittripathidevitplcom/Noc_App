import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateotherdetailsadminforbterComponent } from './updateotherdetailsadminforbter.component';

describe('UpdateotherdetailsadminforbterComponent', () => {
  let component: UpdateotherdetailsadminforbterComponent;
  let fixture: ComponentFixture<UpdateotherdetailsadminforbterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateotherdetailsadminforbterComponent]
    });
    fixture = TestBed.createComponent(UpdateotherdetailsadminforbterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
