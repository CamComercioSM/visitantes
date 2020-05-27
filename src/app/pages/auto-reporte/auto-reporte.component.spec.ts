import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoReporteComponent } from './auto-reporte.component';

describe('AutoReporteComponent', () => {
  let component: AutoReporteComponent;
  let fixture: ComponentFixture<AutoReporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoReporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
