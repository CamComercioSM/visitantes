import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../../servicios/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AlertasService } from 'app/clases/alertas.service';

@Component({
  selector: 'app-visita-evento',
  templateUrl: './visita-evento.component.html',
  styleUrls: ['./visita-evento.component.scss']
})
export class VisitaEventoComponent implements OnInit {

  public visitas=[];
    vacio:boolean=false;
    public VISITATOL=[];
    p: number = 1;
    filtroPost = '';
    entregados:number;
    devueltos:number;
    todos:number;
    GET_VISITAS='administracion/appVisitas/mostrarVisitas/';
    ACTUALIZAR_ESTADOS='administracion/appVisitas/cambiarEstados/';
    constructor(public Alertas: AlertasService,private router: Router,private BaseService: BaseService) {

    }
    ngOnInit(){
       this.getVisitas();
       
    }

    getVisitas(){
        this.BaseService.getJson(this.GET_VISITAS).subscribe((res: any) => {
            
            if (res.DATOS.length==0) {
                this.vacio=true;
            } else {
                this.visitas=res.DATOS;
                this.VISITATOL=res.DATOS;
            }
            this.contadores();
          });
    }
    contadores(){
        this.todos= this.VISITATOL.length;
        this.entregados= this.VISITATOL.filter((obj)=>obj.visitaESTADOCARNET=='ENTREGADO').length;
        this.devueltos= this.VISITATOL.filter((obj)=>obj.visitaESTADOCARNET=='DEVUELTO').length;
    }
    filtrar(estado){
       
        if (estado=='ENTREGADO'|| estado=='DEVUELTO' ) {
            this.visitas= this.VISITATOL.filter((obj)=>obj.visitaESTADOCARNET==estado);
        } else {
            this.visitas= this.VISITATOL;
        }
        if (this.visitas.length==0) {this.vacio=true;this.Alertas.alertSu('info', 'No hay campos en el momento');}
       
    }
    foto(nombre,base64){
        Swal.fire({
            title: "<strong>"+nombre+"</strong>",
            html:
              "<img src='"+base64+"' id='img' alt='foto' class='img-circle img-no-padding img-responsive'>",
            showCloseButton: true
          })
    }

    ModalcambiarEstados(visitaID,i){
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
                this.cambiarEstados(visitaID,0,i);
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
                this.cambiarEstados(visitaID,1,i);
            }
          })
    }

    cambiarEstados(visitaID,visitaEstadoCarnet,i){
        this.BaseService.postJson({
            'visitaID': visitaID ,
            'visitaEstadoCarnet': visitaEstadoCarnet,
          }, this.ACTUALIZAR_ESTADOS).subscribe((res: any) => {
            console.log(res);
            if (res.RESPUESTA=='EXITO') {
                this.Alertas.alertSu('success', 'Actualización Exitosa');
                if (!visitaEstadoCarnet) {
                    this.visitas[i].visitaESTADOCARNET='DEVUELTO';
                    this.VISITATOL[i].visitaESTADOCARNET='DEVUELTO';
                }
                this.visitas[i].visitaESTADOVISITANTE='DESACTIVO';
                this.VISITATOL[i].visitaESTADOVISITANTE='DESACTIVO';
                this.contadores();
            } else {
                this.Alertas.alertOk('error',res.MENSAJE);
              }   
          });
    }



}
