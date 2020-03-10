import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../../servicios/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AlertasService } from 'app/clases/alertas.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'table-cmp',
  moduleId: module.id,
  templateUrl: 'table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {
  public visitas = [];
  vacio: boolean = false;
  p: number = 1;
  filtroPost = '';
  entregados: number;
  devueltos: number;
  todos: number;
  estadoVisitante: string = 'ACTIVO';
  public arrayFinalizadas = [];
  public arrayActivas = [];

  GET_VISITAS_ACTIVAS = 'administracion/appVisitas/listadoVisitasActivas/';
  GET_VISITAS_FINALIZADAS = 'administracion/appVisitas/listadoVisitasFinalizadas/';
  ACTUALIZAR_ESTADOS = 'administracion/appVisitas/cambiarEstadosCarnetYVisitante/';

  DESACTIVO = 'DESACTIVO';
  ACTIVO = 'ACTIVO';
  FINALIZADA = 'FINALIZADA';

  DEVUELTO = 'DEVUELTO';
  ENTREGADO = 'ENTREGADO';
  SIN_CARNET = 'SIN CARNET';

  constructor(public Alertas: AlertasService, private router: Router, private BaseService: BaseService) {

  }



  ngOnInit() {
    this.getVisitasActivas();
    this.getVisitasFinalizadas();

  }

  getVisitasActivas() {
    this.BaseService.getJson(this.GET_VISITAS_ACTIVAS).subscribe((res: any) => {
      if (res.RESPUESTA == 'EXITO') {
        this.arrayActivas = res.DATOS;
        this.visitas = this.arrayActivas;
        this.esVacio(this.visitas);
        this.contadores();
      } else {
        this.Alertas.alertOk('error', res.MENSAJE);
      }
    });
  }
  motivo(nombre, motivo) {
    Swal.fire({
      title: "<strong>" + nombre + " (Motivo)</strong>",
      html:
        "<p>" + motivo + "</p>",
      showCloseButton: true
    })
  }
  getVisitasFinalizadas() {
    this.BaseService.getJson(this.GET_VISITAS_FINALIZADAS).subscribe((res: any) => {
      if (res.RESPUESTA == 'EXITO') {

        this.arrayFinalizadas = res.DATOS;
        
      } else {
        this.Alertas.alertOk('error', res.MENSAJE);
      }
    });
  }

  filtrarPorEstadoVisitante(estado) {
    if (estado == 'ACTIVO') {
      this.visitas = this.arrayActivas;
      this.estadoVisitante = 'ACTIVO';
    } else if (estado == 'FINALIZADA') {
      this.visitas = this.arrayFinalizadas;
      this.estadoVisitante = 'FINALIZADA';
    }
    this.contadores();
    this.esVacio(this.visitas);
  }

  esVacio(array) {
    if (array.length == 0) { this.vacio = true; this.Alertas.alertSu('info', 'No hay campos en el momento'); }
  }
  contadores() {
    this.todos = this.visitas.length;
    this.entregados = this.visitas.filter((obj) => obj.visitaESTADOCARNET == 'ENTREGADO').length;
    this.devueltos = this.visitas.filter((obj) => obj.visitaESTADOCARNET == 'DEVUELTO').length;
  }
  filtrar(estado) {
    if (this.estadoVisitante == this.FINALIZADA) {
      if (estado == 'ENTREGADO' || estado == 'DEVUELTO') {
        this.visitas = this.arrayFinalizadas.filter((obj) => obj.visitaESTADOCARNET == estado);
      }else{
        this.visitas=this.arrayFinalizadas;
      }
    }
    if (this.estadoVisitante == this.ACTIVO) {
      if (estado == 'ENTREGADO' || estado == 'DEVUELTO') {
        this.visitas = this.arrayActivas.filter((obj) => obj.visitaESTADOCARNET == estado);
      }else{
        this.visitas=this.arrayActivas;
      }
    }
    this.esVacio(this.visitas);

  }
  foto(nombre, base64) {
    Swal.fire({
      title: "<strong>" + nombre + "</strong>",
      html:
        "<img src='" + base64 + "' id='img' alt='foto' class='img-circle img-no-padding img-responsive'>",
      showCloseButton: true
    })
  }

  ModalcambiarEstados(visitaID, visitaEstadoVisitante, i, visitaESTADOCARNET) {

    if (visitaEstadoVisitante == this.ACTIVO) {
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
          this.cambiarEstados(visitaID, this.ENTREGADO, visitaEstadoVisitante, i);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.cambiarEstados(visitaID, this.SIN_CARNET, visitaEstadoVisitante, i);
        }
      })
    }

    if (visitaEstadoVisitante == this.FINALIZADA && visitaESTADOCARNET != this.SIN_CARNET) {

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
          this.cambiarEstados(visitaID, this.DEVUELTO, visitaEstadoVisitante, i);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.cambiarEstados(visitaID, this.ENTREGADO, visitaEstadoVisitante, i);
        }
      })

    }
    if (visitaEstadoVisitante == this.FINALIZADA && visitaESTADOCARNET == this.SIN_CARNET) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })

      swalWithBootstrapButtons.fire({
        title: 'Quiere finalizar la visita?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: ' Si ',
        cancelButtonText: ' No ',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          this.cambiarEstados(visitaID, this.SIN_CARNET, visitaEstadoVisitante, i);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {

        }
      })

    }


  }

  cambiarEstados(visitaID, visitaEstadoCarnet, visitaEstadoVisitante, i) {
    
     this.BaseService.postJson({
       'visitaID': visitaID,
       'visitaEstadoCarnet': visitaEstadoCarnet,
       'visitaEstadoVisitante': visitaEstadoVisitante
     }, this.ACTUALIZAR_ESTADOS).subscribe((res: any) => {
       if (res.RESPUESTA == 'EXITO') {

         this.Alertas.alertSu('success', 'Actualización Exitosa');
         
        switch (visitaEstadoVisitante) {
            case this.ACTIVO:
              this.cambiarEstadoVisitante(i, this.ACTIVO);
              break;
            case this.FINALIZADA:
            this.cambiarEstadoVisitante(i, this.FINALIZADA);
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
          this.getVisitasActivas();
         // alert(i);
         // this.visitas.splice(i, 1);
         // this.VISITATOL.splice(i, 1);
        
       } else {
        this.Alertas.alertOk('error', res.MENSAJE);
       }
     });
  }

  cambiarEstadoCarnet(i, estado) {
    this.visitas[i].visitaESTADOCARNET = estado;
    this.arrayActivas[i].visitaESTADOCARNET = estado;
    this.arrayFinalizadas.push(this.visitas[i]);
    console.log(this.arrayActivas);
    console.log(this.visitas);
   
    console.log('eliminadas');
    //  delete this.arrayActivas[i];
    // delete this.visitas[i];
    //this.visitas.splice(i, 1);
    //this.arrayActivas.splice(i, 1);
     console.log(this.arrayActivas);
     console.log(this.visitas);
     this.getVisitasActivas();

    // this.visitas=this.arrayActivas;
    this.esVacio(this.visitas);
    this.contadores();
  }

  cambiarEstadoVisitante(i, estado) {
    this.visitas[i].visitaESTADOVISITANTE = estado;
    this.arrayActivas[i].visitaESTADOVISITANTE = estado;
  }


}
