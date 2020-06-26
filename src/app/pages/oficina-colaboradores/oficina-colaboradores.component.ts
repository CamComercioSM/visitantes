import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'app/servicios/local-storage.service';
import { BaseService } from 'app/servicios/base.service';
import { AlertasService } from 'app/clases/alertas.service';

@Component({
  selector: 'app-oficina-colaboradores',
  templateUrl: './oficina-colaboradores.component.html',
  styleUrls: ['./oficina-colaboradores.component.scss']
})
export class OficinaColaboradoresComponent implements OnInit {
  private CARGAR_OFICINAS='tienda-apps/appVisitas/cargarOficinasYColaboradores/';
  public sedeTitulo;
  public cargarContenido:boolean=true;
  public oficinas=[];
  constructor(public Alertas: AlertasService ,public LocalStorageService: LocalStorageService,private BaseService: BaseService) { }

  ngOnInit() {
    this.cagarOficinas();
  }
  cagarOficinas(){
    this.cargarContenido=true;
    this.BaseService.postJson({
      'sedeID': this.LocalStorageService.get(),
    }, this.CARGAR_OFICINAS).subscribe((res: any) => {
      if (res.RESPUESTA=='EXITO') {
        console.log(res);
        this.oficinas=res.DATOS.Oficinas;
        this.sedeTitulo=res.DATOS.sedeTITULO;
      }else {
        this.Alertas.alertOk('error',res.MENSAJE);
      }
      this.cargarContenido=false;
    });
  }
}
