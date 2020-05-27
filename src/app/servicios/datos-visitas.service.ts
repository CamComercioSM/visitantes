import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatosVisitasService {
 //GUARDADO TEMPORAL DE LOS DATOS DE LA VISITA PARA PRIMERO REALIZAR EL REPORTE ANTES DE GUARDAD

  private datos;
  constructor() { }


  post(datos){
    this.datos=datos;
  }

  get(){
    return this.datos;
  }

}
