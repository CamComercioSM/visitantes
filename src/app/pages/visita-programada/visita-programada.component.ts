import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../../servicios/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AlertasService } from 'app/clases/alertas.service';

@Component({
  selector: 'app-visita-programada',
  templateUrl: './visita-programada.component.html',
  styleUrls: ['./visita-programada.component.scss']
})
export class VisitaProgramadaComponent implements OnInit {

  public visitas = [];
  vacio: boolean = false;
  public VISITATOL = [];
  p: number = 1;
  filtroPost = '';
  date: Date;
  entregados: number;

  devueltos: number;
  todos: number;
  GET_VISITAS = 'administracion/appVisitas/listadoCitasProgramadas/';
  ACTUALIZAR_ESTADOS = 'administracion/appVisitas/cambiarEstadosCarnetYVisitante/';

  DESACTIVO='DESACTIVO';
  ACTIVO='ACTIVO';
  FINALIZADA='FINALIZADA';

  DEVUELTO='DEVUELTO';
  ENTREGADO='ENTREGADO';
  SIN_CARNET='SIN CARNET';

  constructor(public Alertas: AlertasService, private router: Router, private BaseService: BaseService) {

  }
  ngOnInit() {
    this.getVisitas();

  }
  // filtrar por fecha
  filtraFecha() {
    if (this.date) {
      this.visitas = this.VISITATOL.filter((obj) => {
        if (obj.visitaFCHPROGRAMADA) {
          //descomponer fecha del registro
          let fecha = new Date(String(obj.visitaFCHPROGRAMADA));
          let dia = fecha.getDate();
          let mes = fecha.getMonth();
          let anio = fecha.getFullYear();
          let fecha2 = String(anio + "-" + mes + "-" + dia);
          //descomponer fecha busqueda
          let bus = new Date(String(this.date));
          let dia2 = bus.getDate();
          let mes2 = bus.getMonth();
          let anio2 = bus.getFullYear();
          let busqueda = String(anio2 + "-" + mes2 + "-" + (dia2 + 1));

          if (fecha2 == busqueda) {
            return obj;
          }

        } else {

        }

      });
      //console.log(this.visitas);
    } else {
      this.visitas = this.VISITATOL;
    }

    if (this.visitas.length == 0) { this.vacio = true; this.Alertas.alertSu('info', 'No hay campos en el momento'); }

  }

  motivo(nombre,motivo) {
    Swal.fire({
        title: "<strong>" + nombre + " (Motivo)</strong>",
        html:
            "<p>"+ motivo +"</p>",
        showCloseButton: true
    })
  }
  getVisitas() {
    this.BaseService.getJson(this.GET_VISITAS).subscribe((res: any) => {
      if (res.DATOS.length == 0) {
        this.vacio = true;
      } else {
        this.visitas = res.DATOS;
        this.VISITATOL = res.DATOS;
      }
      this.contadores();
    });
  }
  contadores() {
    this.todos = this.VISITATOL.length;
    this.entregados = this.VISITATOL.filter((obj) => obj.visitaESTADOCARNET == this.ENTREGADO).length;
    this.devueltos = this.VISITATOL.filter((obj) => obj.visitaESTADOCARNET == this.DEVUELTO).length;
  }
  filtrar(estado) {

    if (estado == this.ENTREGADO || estado == this.DEVUELTO) {
      this.visitas = this.VISITATOL.filter((obj) => obj.visitaESTADOCARNET == estado);
    } else {
      this.visitas = this.VISITATOL;
    }
    if (this.visitas.length == 0) { this.vacio = true; this.Alertas.alertSu('info', 'No hay campos en el momento'); }

  }


  ModalcambiarEstados(visitaID,visitaEstadoVisitante,i,visitaESTADOCARNET) {

    if(visitaEstadoVisitante==this.ACTIVO){
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
  
      swalWithBootstrapButtons.fire({
        title: 'Se entrego carnet?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: ' Si ',
        cancelButtonText: ' No ',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          this.cambiarEstados(visitaID,this.ENTREGADO,visitaEstadoVisitante, i);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.cambiarEstados(visitaID,this.SIN_CARNET,visitaEstadoVisitante, i);
        }
      });
    }

    if(visitaEstadoVisitante==this.FINALIZADA && visitaESTADOCARNET != this.SIN_CARNET){

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
  
      swalWithBootstrapButtons.fire({
        title: 'El carnet fue devuelto?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: ' Si ',
        cancelButtonText: ' No ',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          this.cambiarEstados(visitaID,this.DEVUELTO,visitaEstadoVisitante, i);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.cambiarEstados(visitaID,this.ENTREGADO,visitaEstadoVisitante, i);
        }
      })

    }
    if (visitaEstadoVisitante==this.FINALIZADA && visitaESTADOCARNET == this.SIN_CARNET) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
  
      swalWithBootstrapButtons.fire({
        title: 'Quiere finalizar la cita?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: ' Si ',
        cancelButtonText: ' No ',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          this.cambiarEstados(visitaID,this.SIN_CARNET,visitaEstadoVisitante, i);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          
        }
      })
      
    }
   
    
  }

  cambiarEstados(visitaID,visitaEstadoCarnet,visitaEstadoVisitante, i) {
    this.BaseService.postJson({
      'visitaID': visitaID,
      'visitaEstadoCarnet': visitaEstadoCarnet,
      'visitaEstadoVisitante':visitaEstadoVisitante
    }, this.ACTUALIZAR_ESTADOS).subscribe((res: any) => {
      console.log(res);
      if (res.RESPUESTA == 'EXITO') {
        this.Alertas.alertSu('success', 'Actualización Exitosa');
        switch (visitaEstadoVisitante) {
          case this.ACTIVO:
            this.cambiarEstadoVisitante(i,this.ACTIVO);
            break;
          case this.FINALIZADA:
            this.cambiarEstadoVisitante(i,this.FINALIZADA);
            break;
          default:
            break;
        }
        switch (visitaEstadoCarnet) {
          case this.DEVUELTO:
            this.cambiarEstadoCarnet(i, this.DEVUELTO);
            break;
          case this.ENTREGADO:
            this.cambiarEstadoCarnet(i, this.ENTREGADO);
            break;
          case this.SIN_CARNET:
            this.cambiarEstadoCarnet(i, this.SIN_CARNET);
            break;
          default:
            break;
        }
        this.contadores();
      } else {
        this.Alertas.alertOk('error', res.MENSAJE);
      }
    });
  }

  cambiarEstadoCarnet(i,estado){
    this.visitas[i].visitaESTADOCARNET = estado;
    this.VISITATOL[i].visitaESTADOCARNET = estado;
  }

  cambiarEstadoVisitante(i,estado){
    this.visitas[i].visitaESTADOVISITANTE = estado;
    this.VISITATOL[i].visitaESTADOVISITANTE = estado;
  }

}
