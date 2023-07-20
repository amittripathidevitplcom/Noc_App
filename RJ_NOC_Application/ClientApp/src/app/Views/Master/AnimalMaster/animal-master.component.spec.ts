import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalMasterComponent } from './animal-master.component';

describe('AnimalMasterComponent', () => {
  let component: AnimalMasterComponent;
  let fixture: ComponentFixture<AnimalMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimalMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
