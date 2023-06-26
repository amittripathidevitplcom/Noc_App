import { TestBed } from '@angular/core/testing';

import { GlobalDataSettingService } from './global-data-setting.service';

describe('GlobalDataSettingService', () => {
  let service: GlobalDataSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalDataSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
