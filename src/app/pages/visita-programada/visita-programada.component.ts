import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../../servicios/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AlertasService } from 'app/clases/alertas.service';
import { NCarnetService } from 'app/servicios/ncarnet.service';
import { LocalStorageService } from 'app/servicios/local-storage.service';
import { DatosVisitasService } from 'app/servicios/datos-visitas.service';

@Component({
  selector: 'app-visita-programada',
  templateUrl: './visita-programada.component.html',
  styleUrls: ['./visita-programada.component.scss']
})
export class VisitaProgramadaComponent implements OnInit {

  public visitas = [];
  vacio: boolean = false;
  public VISITATOL = [];
  N_carnet=[];
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
  PENDIENTE='PENDIENTE';

  constructor( private DatosVisitasService: DatosVisitasService , private LocalStorageService:LocalStorageService ,public Alertas: AlertasService, private router: Router, private BaseService: BaseService, public NCarnetService:NCarnetService) {

  }
  ngOnInit() {
    this.getVisitas();

  }
  // filtrar por fecha
  // filtraFecha() {
  //   if (this.date) {
  //     this.visitas = this.VISITATOL.filter((obj) => {
  //       if (obj.visitaFCHPROGRAMADA) {
  //         //descomponer fecha del registro
  //         let fecha = new Date(String(obj.visitaFCHPROGRAMADA));
  //         let dia = fecha.getDate();
  //         let mes = fecha.getMonth();
  //         let anio = fecha.getFullYear();
  //         let fecha2 = String(anio + "-" + mes + "-" + dia);
  //         //descomponer fecha busqueda
  //         let bus = new Date(String(this.date));
  //         let dia2 = bus.getDate();
  //         let mes2 = bus.getMonth();
  //         let anio2 = bus.getFullYear();
  //         let busqueda = String(anio2 + "-" + mes2 + "-" + (dia2 + 1));

  //         if (fecha2 == busqueda) {
  //           return obj;
  //         }

  //       } else {

  //       }

  //     });
  //     //console.log(this.visitas);
  //   } else {
  //     this.visitas = this.VISITATOL;
  //   }

  //   if (this.visitas.length == 0) { this.vacio = true; this.Alertas.alertSu('info', 'No hay campos en el momento'); }

  // }

  motivo(nombre,motivo) {
    Swal.fire({
        title: "<strong>" + nombre + " (Motivo)</strong>",
        html:
            "<p>"+ motivo +"</p>",
        showCloseButton: true
    })
  }
  getVisitas() {
    let sede = this.LocalStorageService.get();
    this.BaseService.postJson({ 'sedeID': sede },this.GET_VISITAS).subscribe((res: any) => {
      if (res.DATOS.length == 0) {
        this.vacio = true;
      } else {
        this.visitas = res.DATOS;
        this.VISITATOL = res.DATOS;
      }

    });
  }

  esVacio(array) {
    if (array.length == 0) { this.vacio = true; this.Alertas.alertSu('info', 'No hay campos en el momento'); }
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
          this.nCarnet();
          this.modalNumCarnet(visitaID,visitaEstadoVisitante, i);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.cambiarEstados(visitaID,this.SIN_CARNET,visitaEstadoVisitante, i);
        }
      });
    }
  }
  nCarnet(){
    let c='0';
    for (let index = 0; index < 100; index++) {
      if (index<10) {
        this.N_carnet.push(c+index);
      } else {
        this.N_carnet.push(index);
      }
    }
}
  async modalNumCarnet(visitaID,visitaEstadoVisitante, i){
    const { value: formValues } = await Swal.fire({
      title: 'Seleccione el numero de carnet',
      input: 'select',
      inputOptions: this.NCarnetService.getNCarnet(),
      inputPlaceholder: 'Seleccione el numero',
      showCancelButton: true
    });
    let visitaNUMCARNET=formValues;
    if(visitaNUMCARNET){
      this.cambiarEstados(visitaID,this.ENTREGADO,visitaEstadoVisitante, i,visitaNUMCARNET);
      //console.log(visitaNUMCARNET);
    }

  }
  cambiarEstados(visitaID,visitaEstadoCarnet,visitaEstadoVisitante, i,visitaNUMCARNET=null) {

    this.DatosVisitasService.post({
      'visitaID': visitaID,
      'visitaEstadoCarnet': visitaEstadoCarnet,
      'visitaNUMCARNET': visitaNUMCARNET,
      'visitaEstadoVisitante':visitaEstadoVisitante,
      'visitaTIPO':"PROGRAMADA"
    });
    this.router.navigate(['/autoreporte','PROGRAMADA']);
    /*
    this.BaseService.postJson({
      'visitaID': visitaID,
      'visitaEstadoCarnet': visitaEstadoCarnet,
      'visitaNUMCARNET': visitaNUMCARNET,
      'visitaEstadoVisitante':visitaEstadoVisitante,
      'visitaTIPO':"PROGRAMADA"
    }, this.ACTUALIZAR_ESTADOS).subscribe((res: any) => {
      if (res.RESPUESTA == 'EXITO') {
        this.Alertas.alertSu('success', 'Actualización Exitosa');
        this.router.navigateByUrl('table');
        //if (visitaEstadoVisitante==this.ACTIVO) {
          //this.visitas.splice(i, 1);
          //this.VISITATOL.splice(i, 1);
          //this.esVacio(this.visitas);
       // }
      } else {
        this.Alertas.alertOk('error', res.MENSAJE);
      }
    });*/
  }



}
