import { TestBed } from '@angular/core/testing';

import { OutletServiceService } from './outlet-service.service';

describe('OutletServiceService', () => {
  let service: OutletServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutletServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
