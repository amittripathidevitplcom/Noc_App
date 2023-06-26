import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParliamentAreaMasterComponent } from './parliament-area-master.component';

describe('ParliamentAreaMasterComponent', () => {
  let component: ParliamentAreaMasterComponent;
  let fixture: ComponentFixture<ParliamentAreaMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParliamentAreaMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParliamentAreaMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
