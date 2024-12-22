import { TestBed } from '@angular/core/testing';

import { ZakatService } from './zakat.service';

describe('ZakatService', () => {
  let service: ZakatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZakatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
