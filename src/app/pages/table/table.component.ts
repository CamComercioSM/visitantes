import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../../servicios/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AlertasService } from 'app/clases/alertas.service';

@Component({
    selector: 'table-cmp',
    moduleId: module.id,
    templateUrl: 'table.component.html',
    styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {
    public visitas = [];
    vacio: boolean = false;
    public VISITATOL = [];
    p: number = 1;
    filtroPost = '';
    entregados: number;
    devueltos: number;
    todos: number;
    GET_VISITAS = 'administracion/appVisitas/listadoSinCitasPrevias/';
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
        this.entregados = this.VISITATOL.filter((obj) => obj.visitaESTADOCARNET == 'ENTREGADO').length;
        this.devueltos = this.VISITATOL.filter((obj) => obj.visitaESTADOCARNET == 'DEVUELTO').length;
    }
    filtrar(estado) {

        if (estado == 'ENTREGADO' || estado == 'DEVUELTO') {
            this.visitas = this.VISITATOL.filter((obj) => obj.visitaESTADOCARNET == estado);
        } else {
            this.visitas = this.VISITATOL;
        }
        if (this.visitas.length == 0) { this.vacio = true; this.Alertas.alertSu('info', 'No hay campos en el momento'); }

    }
    foto(nombre, base64) {
        Swal.fire({
            title: "<strong>" + nombre + "</strong>",
            html:
                "<img src='" + base64 + "' id='img' alt='foto' class='img-circle img-no-padding img-responsive'>",
            showCloseButton: true
        })
    }

   ModalcambiarEstados(visitaID,visitaEstadoVisitante,i) {

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
      })
    }

    if(visitaEstadoVisitante==this.FINALIZADA){

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
   
    
  }

  cambiarEstados(visitaID,visitaEstadoCarnet,visitaEstadoVisitante, i) {
    this.BaseService.postJson({
      'visitaID': visitaID,
      'visitaEstadoCarnet': visitaEstadoCarnet,
      'visitaEstadoVisitante':visitaEstadoVisitante
    }, this.ACTUALIZAR_ESTADOS).subscribe((res: any) => {
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
