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

  private GET: string = 'tienda-apps/appVisitas/colaboradores/';
  trabajadores = [];
  p: number = 1;
  filtroPost = '';

  constructor(private BaseService: BaseService) { }


  ngOnInit() {
    this.getTrabajadores();
  }


  getTrabajadores() {
    this.BaseService.getJson(this.GET).subscribe((res: any) => {

     // this.trabajadores = res.DATOS;
      this.AsignarEstilosAlerta(res.DATOS);
    });

    // this.BaseService.getJson('administracion/appVisitas/estaLogiado/').subscribe((res: any) => {
    //   console.log(res);
    // });

    // this.BaseService.getJson('administracion/appVisitas/datoSession/').subscribe((res: any) => {
    //   console.log(res);
    // });
  }

  AsignarEstilosAlerta(trabajadores){
    var fechaActual=new Date();
    fechaActual.setHours(0,0,0,0);

    trabajadores.forEach(trabajador => {
      let fechaAutoreporte=new Date(trabajador.autoreporteResultadoFCHCREACION);
      fechaAutoreporte.setHours(0,0,0,0);
      if(trabajador.autoreporteResultadoFCHCREACION){
        if (fechaAutoreporte.getTime()==fechaActual.getTime() && trabajador.autoreporteResultadoRESULTADO != "ALERTA") {

          trabajador.colorEstilo="NORMAL";
        }else{

          trabajador.colorEstilo="ALERTA";
        }
      }else{
        trabajador.colorEstilo="VACIO";


      }

      //trabajador.Estilo="ALERTA";
    });
    this.trabajadores = trabajadores;
  }

}
