import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '../../servicios/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'app/servicios/local-storage.service';
import Swal from'sweetalert2';
import { AlertasService } from 'app/clases/alertas.service';
import { AuthService } from 'app/servicios/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public sede = [];
  dataC: FormGroup;
  on:boolean=false;
  private POST = 'administracion/appVisitas/autenticarColaborador/';
  private DATOSEDE = 'administracion/appVisitas/datosLogin/';
  private VALIDAR_CORREO='administracion/appVisitas/validarCorreo/';
  constructor(public afAuth: AngularFireAuth, public AuthService:AuthService,private router: Router, private BaseService: BaseService,public Alertas:AlertasService , private LocalStorageService:LocalStorageService) {
    this.dataC = new FormGroup({
      cedula: new FormControl('', Validators.required),
      sede: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.datosSede();
  }

  datosSede() {
    this.BaseService.getJson(this.DATOSEDE).subscribe((res: any) => {
      this.sede=res.DATOS;
    });
  }

  login() {
    this.on=true;
    let cedula = this.dataC.value.cedula;
    this.BaseService.postJson({ 'cedula': cedula }, this.POST).subscribe((res: any) => {
      if (res.RESPUESTA=='EXITO') {
        this.on=false;
        this.LocalStorageService.post(this.dataC.value.sede);
        this.LocalStorageService.postDatos(cedula,res.DATOS);
        this.LocalStorageService.login();
        this.Alertas.alertCe('success','Bienvenido '+ res.DATOS );
        this.router.navigateByUrl("registrar");
        location.reload();
      } else {
        this.Alertas.alertOk('error',res.MENSAJE);
        this.on=false;
        // Swal.fire({
        //   icon: 'error',
        //   text: res.MENSAJE,
        // })
      }
      

    });

  }

  onLoginGoogle(){
    if (!this.dataC.value.sede) {
      this.Alertas.alertOk('error','Ingrese la sede');
    }else{
    this.AuthService.loginGoogleUser().then((res) => {
        
        //console.log(res);
        this.validarPorCorreo(res.email,res.displayName);
        // this.router.navigateByUrl('registrar');
        // this.Alertas.alertCe('success','Bienvenido ');
      }).catch(err => console.log('err', err.message));
  }}

  validarPorCorreo(correo,nombre){
    this.BaseService.postJson({ 'correo': correo }, this.VALIDAR_CORREO).subscribe((res: any) => {
      if (res.RESPUESTA=='EXITO') {
        this.LocalStorageService.post(this.dataC.value.sede);
        this.LocalStorageService.postDatos("",nombre);
        this.LocalStorageService.login();
        this.Alertas.alertCe('success','Bienvenido');
        this.router.navigateByUrl("registrar");
        location.reload();
      } else {
        this.Alertas.alertOk('error',res.MENSAJE);
        this.logoutUser();
        //this.on=false;
        // Swal.fire({
        //   icon: 'error',
        //   text: res.MENSAJE,
        // })
      }
    });
  }
  logoutUser() {
    this.AuthService.logoutUser();
  }
  
}
