import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '../../servicios/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'app/servicios/local-storage.service';
import { AlertasService } from 'app/clases/alertas.service';
import { DatosVisitasService } from 'app/servicios/datos-visitas.service';
@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent implements AfterViewInit {
  private POST = 'tienda-apps/appVisitas/guardarYActivarVisita/';
  private DATOFORMULARIO = 'tienda-apps/appVisitas/datosFormulario/';
  private BUSCARDATOS='personas/datosPersonales/consultaPorIdentificacion';
  private BUSCAR_COLABORADORES_OFICINA='tienda-apps/appVisitas/colaboradoresPorOficina/';
  @ViewChild("video", { static: false })
  public video: ElementRef;

  OffOn:boolean=false;

  @ViewChild("canvas", { static: false })
  public canvas: ElementRef;
  public colaboradores = [];
  public colaboradoresTodos=[];
  public oficinas=[];
  public tipoIdentificacion = [];
  public photo: any;
  public dispositivosDeVideo = [];
  public oficinaID="";
  N_carnet=[];
  data: FormGroup;
  on:boolean=false;
  buscarOn:boolean=false;
  cargaColaboradores:boolean=false;
  constructor(public Alertas: AlertasService, private router: Router, private BaseService: BaseService, public LocalStorageService: LocalStorageService, public DatosVisitasService:DatosVisitasService ) {
    this.data = new FormGroup({
      nombre: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(15)])),
      apellido: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(15)])),
      numeroCelular: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(15)])),
      cedula: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
      id_carnet: new FormControl('', Validators.compose([Validators.maxLength(10)])),
      visitar_a: new FormControl('', Validators.required),
      tipoIdentificacion: new FormControl('', Validators.required),
      visitaMOTIVO:new FormControl(''),
    });
  }

  public ngAfterViewInit() {
    this.dispositivosActivos();
    this.datoFormulario();
    this.nCarnet();
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
  dispositivosActivos() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Comenzamos pidiendo los dispositivos
      navigator.mediaDevices.enumerateDevices().then(dipo => {
        dipo.forEach(dispositivo => {
          const tipo = dispositivo.kind;
          if (tipo === "videoinput") {
            this.dispositivosDeVideo.push(dispositivo);
          }
        });
      });
      // this.prender();
    }
  }

  public prender(idDispositivo = null) {
    this.OffOn=true;
    if (idDispositivo == null) {
      for (let index = 0; index == 0; index++) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
        });
      }
    } else {
      navigator.mediaDevices.getUserMedia({ video: { deviceId: idDispositivo } }).then(stream => {
        this.video.nativeElement.srcObject = stream;
        this.video.nativeElement.play();
      });
    }
  }

  public cambiarDispositivo(idDispositivo) {

    this.apagar();
    this.prender(idDispositivo);
  }

  public datoFormulario() {
    this.BaseService.postJson({
      'sedeID': this.LocalStorageService.get(),
    },this.DATOFORMULARIO).subscribe((res: any) => {
      this.colaboradores = res.DATOS.Colaboradores;
      //this.colaboradoresTodos=res.DATOS.Colaboradores;
      this.tipoIdentificacion = res.DATOS.TiposIdentificaciones;
      //this.oficinas=res.DATOS.SedesOficinas;
    });

  }

  public cambiarOficina(){

    if(this.oficinaID){
      this.cargaColaboradores=true;
      this.BaseService.postJson({
        'sedeOficinaID': this.oficinaID,
      }, this.BUSCAR_COLABORADORES_OFICINA).subscribe((res: any) => {
        if (res.RESPUESTA=='EXITO') {
          console.log(res);
          this.colaboradores = res.DATOS.Colaboradores;

        }else {
          this.Alertas.alertOk('error',res.MENSAJE);
        }
        this.cargaColaboradores=false;
      });
    }else{
      this.colaboradores = this.colaboradoresTodos;
    }

  }

  public apagar() {
    this.OffOn=false;
    try {
      this.video.nativeElement.srcObject.getVideoTracks().forEach(function (track) {
        track.stop();
      });
    } catch (error) {

    }
  }

  public capture() {
    var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);
    this.photo = this.canvas.nativeElement.toDataURL("image/png");
    this.apagar();
  }

  buscar(){
    this.buscarOn=true;
    if(this.data.value.cedula!=""){

      this.BaseService.postJson({
        'personaIDENTIFICACION': this.data.value.cedula,
      }, this.BUSCARDATOS).subscribe((res: any) => {
        if (res.RESPUESTA=='EXITO') {
          console.log(res);
          this.data.controls['numeroCelular'].setValue((res.DATOS.telefonoNUMEROCELULAR) ? res.DATOS.telefonoNUMEROCELULAR : "" );
          this.data.controls['nombre'].setValue(res.DATOS.personaPRIMERNOMBRE);
          this.data.controls['tipoIdentificacion'].setValue(res.DATOS.tipoIdentificacionID);
          this.data.controls['apellido'].setValue(res.DATOS.personaPRIMERAPELLIDO);
          //this.data.controls['cedula'].setValue('');
          this.buscarOn=false;
        }else {
          this.Alertas.alertOk('error',res.MENSAJE);
          this.buscarOn=false;
        }

      });
    }else{
      this.buscarOn=false;
      this.Alertas.alertOk('error','Ingrese la cedula para buscar los datos');
    }
  }

  registrar() {

    this.on=true;
    if (!this.data.valid) {

        this.Alertas.alertOk('error','Ingrese los datos faltantes');
        this.on=false;
    } else {
      if (this.OffOn) {
        this.capture();
      }
      let sede = this.LocalStorageService.get();

     this.DatosVisitasService.post({
      'visitaNUMCARNET': this.data.value.id_carnet,
      'visitaFOTO': this.photo,
      'colaboradorID': this.data.value.visitar_a,
      'sedeID': sede,
      'tipoIdentificacionID': this.data.value.tipoIdentificacion,
      'personaIDENTIFICACION': this.data.value.cedula,
      'visitaTIPO':"SIN CITA PREVIA",
      'visitaESTADOCARNET': this.data.value.id_carnet==""? "SIN CARNET" : "ENTREGADO",
      'visitaMOTIVO':this.data.value.visitaMOTIVO,
      'personaPRIMERNOMBRE':this.data.value.nombre ,
      'personaPRIMERAPELLIDO':this.data.value.apellido,
      'telefonoNUMEROCELULAR' : this.data.value.numeroCelular
    });
    this.router.navigate(['/autoreporte','SIN CITA PREVIA']);
      /*this.BaseService.postJson({
        'visitaNUMCARNET': this.data.value.id_carnet,
        'visitaFOTO': this.photo,
        'colaboradorID': this.data.value.visitar_a,
        'sedeID': sede,
        'tipoIdentificacionID': this.data.value.tipoIdentificacion,
        'personaIDENTIFICACION': this.data.value.cedula,
        'visitaTIPO':"SIN CITA PREVIA",
        'visitaESTADOCARNET': this.data.value.id_carnet==""? "SIN CARNET" : "ENTREGADO",
        'visitaMOTIVO':this.data.value.visitaMOTIVO,
        'personaPRIMERNOMBRE':this.data.value.nombre ,
        'personaPRIMERAPELLIDO':this.data.value.apellido
      }, this.POST).subscribe((res: any) => {
        if (res.RESPUESTA=='EXITO') {
          this.on=false;
          this.Alertas.alertSu('success', 'Registro Exitoso');
          this.router.navigateByUrl('table');
        }else {
          this.on=false;
          this.Alertas.alertOk('error',res.MENSAJE);
        }

      });*/
    }
  }

  limpiarCampos() {
    this.data.controls['nombre'].setValue('');
    this.data.controls['tipoIdentificacion'].setValue('');
    this.data.controls['apellido'].setValue('');
    this.data.controls['cedula'].setValue('');
    this.data.controls['visitar_a'].setValue('');
    this.data.controls['id_carnet'].setValue('');
    this.data.controls['visitaMOTIVO'].setValue('');
    this.data.controls['numeroCelular'].setValue('');
    this.photo = '';
    //this.prender();
  }
  cancelar() {
    this.limpiarCampos();
  }
  ngOnDestroy() {
    this.apagar();
  }


}
