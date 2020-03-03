import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../servicios/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-trabajador',
  templateUrl: './trabajador.component.html',
  styleUrls: ['./trabajador.component.scss']
})
export class TrabajadorComponent implements OnInit {

  private GET: string = 'administracion/appVisitas/colaboradores/';
  trabajadores = [];
  p: number = 1;
  filtroPost = '';

  constructor(private BaseService: BaseService) { }


  ngOnInit() {
    this.getTrabajadores();
  }


  getTrabajadores() {
    this.BaseService.getJson(this.GET).subscribe((res: any) => {
      // console.log(res);
      this.trabajadores = res.DATOS;
    });

    // this.BaseService.getJson('administracion/appVisitas/estaLogiado/').subscribe((res: any) => {
    //   console.log(res);
    // });

    // this.BaseService.getJson('administracion/appVisitas/datoSession/').subscribe((res: any) => {
    //   console.log(res);
    // });
  }

}
