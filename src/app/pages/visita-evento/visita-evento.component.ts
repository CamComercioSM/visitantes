import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../../servicios/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AlertasService } from 'app/clases/alertas.service';
import { isUndefined } from 'util';
import { LocalStorageService } from 'app/servicios/local-storage.service';
import { NCarnetService } from 'app/servicios/ncarnet.service';
@Component({
  selector: 'app-visita-evento',
  templateUrl: './visita-evento.component.html',
  styleUrls: ['./visita-evento.component.scss']
})
export class VisitaEventoComponent implements OnInit {

  public visitas = [];
  vacio: boolean = false;
  vacio2:boolean=false;
  public VISITATOL = [];
  p: number = 1;
  filtroPost = '';
  entregados: number;
  devueltos: number;
  todos: number;
  selectEvento = ' ';
  selectAnterior;

  on=false;
 
  // informacion de evento
  eventoDESCRIPCION;
  eventoFCHINICIO ;
  eventoFCHFINAL;
  eventoLUGAR ;
  eventoUSRCREO;

  //asistentes
  public eventoSelec:any=[];
  public eventosTodos:any=[];
  private POST = 'administracion/appVisitas/guardarYActivarVisita/';
  GET_EVENTOS_DATOS= 'administracion/appVisitas/listadoEventosYAsistentes/';
 
  
  N_carnet=[];
  DEVUELTO='DEVUELTO';
  ENTREGADO='ENTREGADO';
  SIN_CARNET='SIN CARNET';
  PENDIENTE='PENDIENTE';
  constructor(public Alertas: AlertasService, private router: Router, private BaseService: BaseService, public LocalStorageService: LocalStorageService, public NCarnetService:NCarnetService) {

  }

  ngOnInit() {
    this.getEventos();
  }

  getEventos() {
    let sedeID = this.LocalStorageService.get();
    this.BaseService.postJson({ 'sedeID': sedeID },this.GET_EVENTOS_DATOS).subscribe((res: any) => {
      if (res.RESPUESTA == 'EXITO') {
        if (res.DATOS==null || res.DATOS.length == 0 ) {
          this.Alertas.alertSu('info', 'No hay eventos en el momento');
          this.vacio = true;
        } else {
           //console.log(res.DATOS);
           this.eventosTodos=res.DATOS;
           //alert(this.eventosTodos[0].eventoFCHINICIO);
           this.infoEvento();
           this.on=true;
        }
      }else {
        this.Alertas.alertOk('error', res.MENSAJE);
      }
    });
  }

  infoEvento(selectEvento='1') {
   
     if (selectEvento != undefined && this.selectAnterior != selectEvento && selectEvento!=" ") {
     if (selectEvento=='1') {
      this.eventoSelec=this.eventosTodos[0];
      this.esVacioAsistentes(this.eventoSelec.asistentes);
     }else{
      let filtro= this.eventosTodos.filter(res => selectEvento == res.eventoID);
      if (this.eventoSelec.length != 0) {
        this.eventoSelec=filtro[0];
        this.esVacioAsistentes(this.eventoSelec.asistentes);
      } else {
        this.vacio = true;
        this.Alertas.alertSu('info', 'No hay eventos en el momento');
      }
     }
      this.selectAnterior = selectEvento;
     }
  }

  esVacioAsistentes(array) {
    if (array.length == 0) { this.vacio2 = true; this.Alertas.alertSu('info', 'No hay campos en el momento'); }
  }
 
  ModalcambiarEstados(eventoID,eventoAsistenteID,personaID){

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
          this.modalNumCarnet(eventoID,eventoAsistenteID,personaID);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.cambiarEstados(eventoID,eventoAsistenteID,personaID,this.SIN_CARNET);
        }
      });
  
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
  async modalNumCarnet(eventoID,eventoAsistenteID,personaID){
    const { value: formValues } = await Swal.fire({
      title: 'Seleccione el numero de carnet',
      input: 'select',
      inputOptions: this.NCarnetService.getNCarnet(),
      inputPlaceholder: 'Seleccione el numero',
      showCancelButton: true
    });
    
    let visitaNUMCARNET=formValues;
    if(visitaNUMCARNET){
      
      this.cambiarEstados(eventoID,eventoAsistenteID,personaID,this.ENTREGADO,visitaNUMCARNET);
      
    }
    
  }
  cambiarEstados(eventoID,eventoAsistenteID,personaID,visitaESTADOCARNET,visitaNUMCARNET=null) {
    let sedeID = this.LocalStorageService.get();
    this.BaseService.postJson({
       'visitaTIPO': 'EVENTOS' ,
        'eventoID': eventoID,
       'eventoAsistenteID': eventoAsistenteID,
       'sedeID': sedeID,
       'personaID': personaID,
       'visitaNUMCARNET': visitaNUMCARNET,
       'visitaESTADOCARNET': visitaESTADOCARNET,
       'colaboradorID': this.eventoSelec.colaboradorID
     }, this.POST).subscribe((res: any) => {
       if (res.RESPUESTA=='EXITO') {
         this.Alertas.alertSu('success', 'Registro Exitoso');
         this.router.navigateByUrl('table');
       }else {
         this.Alertas.alertOk('error',res.MENSAJE);
       }});
      
      }


}

