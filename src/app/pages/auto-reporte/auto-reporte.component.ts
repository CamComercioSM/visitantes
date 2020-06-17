import { Component, OnInit } from '@angular/core';
import { BaseService } from 'app/servicios/base.service';
import { AlertasService } from 'app/clases/alertas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosVisitasService } from 'app/servicios/datos-visitas.service';
import { FormArray,FormBuilder } from '@angular/forms';
import * as jQuery from 'jquery';
@Component({
  selector: 'app-auto-reporte',
  templateUrl: './auto-reporte.component.html',
  styleUrls: ['./auto-reporte.component.scss']
})
export class AutoReporteComponent implements OnInit {
  //para eventos y nuevo_visitante
  private GUARDAR_VISITA = 'tienda-apps/appVisitas/guardarYActivarVisita/';
  //para programadas
  private ACTUALIZAR_ESTADOS_Visitas = 'tienda-apps/appVisitas/cambiarEstadosCarnetYVisitante/';
  //dependiendo por donde entra a esta vista, se selccionara una url.
  private  URL_SELECCIONADA:String;
  private GUARDAR_AUTOREPORTE  = 'tienda-apps/appVisitas/guardarAutoreporte/';
  private GET_DATOS_AUTOREPORTE = 'tienda-apps/appVisitas/datosAutoreporteCOVID19/';
  preguntas;
  private datosVisita;
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
        this.datosVisita=this.DatosVisitasService.get();
        console.log(this.datosVisita);

        if (this.datosVisita) {
          switch (tipoVisita) {
            case 'SIN CITA PREVIA':
              this.URL_SELECCIONADA=this.GUARDAR_VISITA;
            break;
            case 'EVENTOS':
              this.URL_SELECCIONADA=this.GUARDAR_VISITA;
            break;
            case 'PROGRAMADA':
              this.URL_SELECCIONADA=this.ACTUALIZAR_ESTADOS_Visitas;
            break;
            default:
              this.router.navigateByUrl('table');
              break;
          }
          this.getDatos();
        }else{
          this.router.navigateByUrl('table');
        }

    });



  }

 checkboxRespuesta(preguntaID) {
    jQuery('.opcionNinguno'+preguntaID).prop("checked", false);
  }
  checkboxNinguno(preguntaID) {
    jQuery('.opcionRespuesta'+preguntaID).prop("checked", false);
  }
 checkboxTodos(preguntaID, claseACcion) {
  jQuery('.' + claseACcion + preguntaID).prop("checked", true);
  jQuery('.checkboxRespuesta'+preguntaID).prop("checked", false);
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

  GuardarVisita(serializedJSON){
    this.cargar=true;
    let datosTodos=Object.assign(this.datosVisita, serializedJSON);
    //datosVisitas.AutrorepoteCOVID19 = serializedJSON;
    console.log(datosTodos);

    this.BaseService.postJson(
      datosTodos
      , this.URL_SELECCIONADA).subscribe((res: any) => {
        console.log(res);

        switch (res.RESPUESTA) {
          case 'EXITO':
            this.Alertas.alertSu('success', 'Registro Exitoso');
            this.router.navigateByUrl('table');
          break;
          case 'ALERTA':
            this.Alertas.alertOk('warning',res.MENSAJE);
            this.router.navigateByUrl('registrar');
          break;
          default:
            this.Alertas.alertOk('error',res.MENSAJE);
            break;
        }

      this.cargar=false;
    });
  }


  dataFormulario(){
    console.log( jQuery("#frm").serializeArray());
    var serializeArray=jQuery("#frm").serializeArray();
    var datosDePreguntas=this.cambiarEstructura(serializeArray);
    let edad=jQuery("#edad").val();
    let temperatura=jQuery("#temperatura").val();
    console.log(Object.keys(datosDePreguntas).length);

    if(this.preguntas.length==Object.keys(datosDePreguntas).length && edad != "" && temperatura != ""){
      let jsonAutoreporte={
          'preguntasYrespuestasCOVID19':datosDePreguntas,
          'personaEDAD': edad,
          'personaTEMPERATURA': temperatura
      };
      this.GuardarVisita(jsonAutoreporte);
      console.log(jsonAutoreporte);
      console.log("enviar");
    }else{
      this.Alertas.alertOk('info',"Responde todas las preguntas.");
     // console.log("Responde todas las preguntas.");
    }


    //
    //var formElement = document.getElementById("frm");
    //var formdata = new FormData(formElement);
    //console.log(formdata);
    /*var object = {};
    for (var key of formdata.entries()) {
        console.log(key[0] + ', ' + key[1]);
        object[key[0]] =  key[1];
    }
    var json = JSON.stringify(object);
    console.log(object);
    console.log(json);*/
    //this.GuardarVisita(json);

   /* this.BaseService.postJson(
      jQuery("#frm").serialize()
    , this.GUARDAR_AUTOREPORTE).subscribe((res: any) => {
    if (res.RESPUESTA=='EXITO') {
      alert("listo");
       console.log(res.DATOS);
    }else {
      this.Alertas.alertOk('error',res.MENSAJE);
    }

  });*/

  }

  cambiarEstructura(serializeArray){
    var datosDePreguntas=[];
    var obj={};
    serializeArray.forEach(input=>{
      var nombreInputArray=input.name.split("-");
      //si el nombre esta separado con - si es una pregunta
      if(nombreInputArray.length==2){
        let preguntaID=nombreInputArray[1];
        if(nombreInputArray[0]=='unaOpcionRespuesta'){
          obj[preguntaID]=input.value;
        }else{
          if(obj[preguntaID]){
            obj[preguntaID].push(input.value);
          }else{
            obj[preguntaID]=[input.value];
          }
        }
      }
    });
    console.log(obj);
    return obj;
  }

}
