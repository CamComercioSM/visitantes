import { TestBed } from '@angular/core/testing';

import { NCarnetService } from './ncarnet.service';

describe('NCarnetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NCarnetService = TestBed.get(NCarnetService);
    expect(service).toBeTruthy();
  });
});
