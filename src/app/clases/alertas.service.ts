import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor() { }

  alertOk(icono, mensaje) {
    return Swal.fire({
      icon: icono,
      text: mensaje,
    });
  }

  alertSu(icono, mensaje){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon:  icono,
      title: mensaje
    })
  }

  alertCe(icono, mensaje){
    Swal.fire({
      position: 'center',
      icon: icono,
      title: mensaje,
      showConfirmButton: false,
      timer: 1500
    })
  }


}
