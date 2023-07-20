import { TestBed } from '@angular/core/testing';

import { AnimalmasterService } from './animalmaster.service';

describe('AnimalmasterService', () => {
  let service: AnimalmasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimalmasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
