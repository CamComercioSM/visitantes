import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(value:any,arg): any {
     const resultPost=[];
     value.forEach(element => {
       let palabras=String (element.visitaESTADOVISITANTE +" "+
       element.visitaESTADOCARNET+" "+
       element.visitaNUMCARNET+" "+
       element.sedeTITULO+" "+
       element.personaRAZONSOCIAL+" "+
       element.personaIDENTIFICACION+" "+
       element.ColaboradorRAZONSOCIAL+" "+
       element.UsrCreoRAZONSOCIAL);

       if (palabras.toLowerCase().indexOf(arg.toLowerCase())> -1) {
         resultPost.push(element);
       }
     });
    // console.log(value +' arg=>'+arg);
    return resultPost;
    
  }

}
