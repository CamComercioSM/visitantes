import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  sede:string;
  plainText: string;
  encryptText: string;
  encPassword: string='2014114194_S';
  decPassword: string="2014114194_S";
  private Nlogin:any='P/M1jROVbx';
  private Nsede:any='q0sEoCh5Fz';
  private Nnombre:any='L3fhJDKXDz';
  private Ncedula:any='xHc29e9cBF';
  
  post(sed){
    localStorage.setItem(this.Nsede,this.encrypt(String(sed)));
  }
  get(){
    let text=localStorage.getItem(this.Nsede);
      if (text) {
        let valor=this.decrypt(text) ;
        return valor;
      } else {
        return text;
      } 
    } 
    
    postDatos(cedula,nombre){
      localStorage.setItem(this.Ncedula,this.encrypt(String(cedula)));
      localStorage.setItem(this.Nnombre,this.encrypt(nombre));
    }
    
    getDatos(dato){
      let text;
      switch (dato) {
        case 'login':
          text=localStorage.getItem(this.Nlogin);
          break;
        case 'nombre':
          text=localStorage.getItem(this.Nnombre);
          break;
        case 'cedula':
          text=localStorage.getItem(this.Ncedula);
          break;
        case 'sede':
          text=localStorage.getItem(this.Nsede);
          break;
        default:
          break;
      }
      if (text||text!=null) {
        let valor=this.decrypt(text) ;
        return valor;
      } else {
        return text;
      }
      
    }

    login(){
      localStorage.setItem(this.Nlogin, this.encrypt('true'));
    }

    encrypt(text){
      let valor =CryptoJS.AES.encrypt(text.trim(), this.encPassword.trim()).toString();
     return valor;
    }
    decrypt(text){
      let valor=CryptoJS.AES.decrypt(text.trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8);
      console.log(valor +23);
      return valor ;
    }



}

