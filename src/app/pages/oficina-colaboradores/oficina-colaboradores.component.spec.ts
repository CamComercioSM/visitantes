import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OficinaColaboradoresComponent } from './oficina-colaboradores.component';

describe('OficinaColaboradoresComponent', () => {
  let component: OficinaColaboradoresComponent;
  let fixture: ComponentFixture<OficinaColaboradoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OficinaColaboradoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OficinaColaboradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
