import { Component, OnInit } from '@angular/core';
import { BaseService } from 'app/servicios/base.service';
import { AlertasService } from 'app/clases/alertas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosVisitasService } from 'app/servicios/datos-visitas.service';
import { FormArray,FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-auto-reporte',
  templateUrl: './auto-reporte.component.html',
  styleUrls: ['./auto-reporte.component.scss']
})
export class AutoReporteComponent implements OnInit {
  //para eventos y nuevo_visitante
  private GUARDAR_VISITA = 'administracion/appVisitas/guardarYActivarVisita/';
  //para programadas
  private ACTUALIZAR_ESTADOS_Visitas = 'administracion/appVisitas/cambiarEstadosCarnetYVisitante/';
  //dependiendo por donde entra a esta vista, se selccionara una url.
  private  URL_SELECCIONADA:String;

  private GET_DATOS_AUTOREPORTE = 'administracion/appVisitas/datosAutoreporteCOVID19/';
  preguntas;
  cargar:boolean=true;
  formulario;
  constructor(
    public BaseService:BaseService,
    public Alertas: AlertasService,
    private route: ActivatedRoute,
    private router: Router,
    private DatosVisitasService:DatosVisitasService,
    private fb: FormBuilder
    ) {

   }

  ngOnInit() {
    this.route.params.subscribe(params => {
         let tipoVisita = params['tipoVisita'];
        //alert(tipoVisita );
    });
    this.getDatos();

  }

  getDatos() {

    this.BaseService.postJson({ },this.GET_DATOS_AUTOREPORTE).subscribe((res: any) => {
      if (res.RESPUESTA == 'EXITO') {
        this.preguntas=res.DATOS;


         console.log(this.preguntas);
      }else {
        this.Alertas.alertOk('error', res.MENSAJE);
      }
      this.cargar=false;
    });
  }

  GuardarVisita(){
    let datosVisitas=this.DatosVisitasService.get();
    console.log(this.DatosVisitasService.get());
    this.BaseService.postJson(
        datosVisitas
      , this.GUARDAR_VISITA).subscribe((res: any) => {
      if (res.RESPUESTA=='EXITO') {
        this.Alertas.alertSu('success', 'Registro Exitoso');
        this.router.navigateByUrl('table');
      }else {
        this.Alertas.alertOk('error',res.MENSAJE);
      }

    });
  }


  dataFormulario(){




  }
}
