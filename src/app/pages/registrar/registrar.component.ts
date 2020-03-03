import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '../../servicios/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'app/servicios/local-storage.service';
import { AlertasService } from 'app/clases/alertas.service';
@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent implements AfterViewInit {
  private POST = 'administracion/appVisitas/guardarYActivarVisita/';
  private DATOFORMULARIO = 'administracion/appVisitas/datosFormulario/';
  @ViewChild("video", { static: false })
  public video: ElementRef;

  OffOn:boolean=false;

  @ViewChild("canvas", { static: false })
  public canvas: ElementRef;
  public colaboradores = [];
  public tipoIdentificacion = [];
  public photo: any;
  public dispositivosDeVideo = [];
  N_carnet=[];
  data: FormGroup;

  constructor(public Alertas: AlertasService, private router: Router, private BaseService: BaseService, public LocalStorageService: LocalStorageService) {
    this.data = new FormGroup({
      nombre: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(15)])),
      apellido: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(15)])),
      cedula: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
      id_carnet: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
      visitar_a: new FormControl('', Validators.required),
      tipoIdentificacion: new FormControl('', Validators.required),
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
    console.log(idDispositivo);
    this.apagar();
    this.prender(idDispositivo);
  }

  public datoFormulario() {
    this.BaseService.getJson(this.DATOFORMULARIO).subscribe((res: any) => {
      this.colaboradores = res.DATOS.Colaboradores;
      this.tipoIdentificacion = res.DATOS.TiposIdentificaciones;

    });
  }

  public apagar() {
    this.OffOn=false;
    try {
      this.video.nativeElement.srcObject.getVideoTracks().forEach(function (track) {
        track.stop();
      });
    } catch (error) {
      console.log(error);
    }
  }

  public capture() {
    var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);
    this.photo = this.canvas.nativeElement.toDataURL("image/png");
    this.apagar();
  }

  registrar() {
    if (!this.data.valid) {
      // if (!this.OffOn) {
      //   this.Alertas.alertOk('error','Prenda la camara ');
      // } else {
        this.Alertas.alertOk('error','Ingrese los datos faltantes');
      //}
    } else {
      if (this.OffOn) {
        this.capture();
      }
      let sede = this.LocalStorageService.get();
      this.BaseService.postJson({
        'visitaNUMCARNET': this.data.value.id_carnet,
        'visitaFOTO': this.photo,
        'colaboradorID': this.data.value.visitar_a,
        'sedeID': sede,
        'tipoIdentificacionID': this.data.value.tipoIdentificacion,
        'personaIDENTIFICACION': this.data.value.cedula,
        'personaRAZONSOCIAL': this.data.value.nombre + ' ' + this.data.value.apellido
      }, this.POST).subscribe((res: any) => {
        if (res.RESPUESTA=='EXITO') {
          this.Alertas.alertSu('success', 'Registro Exitoso');
          this.router.navigateByUrl('table');
        }else {
          this.Alertas.alertOk('error',res.MENSAJE);
        }

      });
    }
  }

  limpiarCampos() {
    this.data.controls['nombre'].setValue('');
    this.data.controls['tipoIdentificacion'].setValue('');
    this.data.controls['apellido'].setValue('');
    this.data.controls['cedula'].setValue('');
    this.data.controls['visitar_a'].setValue('');
    this.data.controls['id_carnet'].setValue('');
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
