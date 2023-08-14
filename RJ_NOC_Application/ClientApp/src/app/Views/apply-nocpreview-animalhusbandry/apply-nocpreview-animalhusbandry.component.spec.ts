import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNocpreviewAnimalhusbandryComponent } from './apply-nocpreview-animalhusbandry.component';

describe('ApplyNocpreviewAnimalhusbandryComponent', () => {
  let component: ApplyNocpreviewAnimalhusbandryComponent;
  let fixture: ComponentFixture<ApplyNocpreviewAnimalhusbandryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyNocpreviewAnimalhusbandryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNocpreviewAnimalhusbandryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
