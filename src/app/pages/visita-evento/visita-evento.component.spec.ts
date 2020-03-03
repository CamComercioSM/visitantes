import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitaEventoComponent } from './visita-evento.component';

describe('VisitaEventoComponent', () => {
  let component: VisitaEventoComponent;
  let fixture: ComponentFixture<VisitaEventoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitaEventoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitaEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
