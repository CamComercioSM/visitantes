import { TestBed } from '@angular/core/testing';

import { DatosVisitasService } from './datos-visitas.service';

describe('DatosVisitasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatosVisitasService = TestBed.get(DatosVisitasService);
    expect(service).toBeTruthy();
  });
});
