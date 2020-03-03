import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitaProgramadaComponent } from './visita-programada.component';

describe('VisitaProgramadaComponent', () => {
  let component: VisitaProgramadaComponent;
  let fixture: ComponentFixture<VisitaProgramadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitaProgramadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitaProgramadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
