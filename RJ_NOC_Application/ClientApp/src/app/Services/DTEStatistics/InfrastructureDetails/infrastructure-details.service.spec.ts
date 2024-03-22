import { TestBed } from '@angular/core/testing';

import { InfrastructureDetailsService } from './infrastructure-details.service';

describe('InfrastructureDetailsService', () => {
  let service: InfrastructureDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfrastructureDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
