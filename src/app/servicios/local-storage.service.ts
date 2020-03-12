import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  sede:string;
  post(sed){
    localStorage.setItem('sede',sed);
  }
  get(){
    return localStorage.getItem('sede') ;
    } 
    postDatos(cedula,nombre){
      localStorage.setItem('cedula',cedula);
      localStorage.setItem('nombre',nombre);
    }
    getDatos(dato){
      return localStorage.getItem(dato) ;
    }

    login(){
      localStorage.setItem('login', 'true');
    }


    
}
