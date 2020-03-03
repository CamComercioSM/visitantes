import { TestBed } from '@angular/core/testing';

import { EndpoindService } from './endpoind.service';

describe('EndpoindService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EndpoindService = TestBed.get(EndpoindService);
    expect(service).toBeTruthy();
  });
});
