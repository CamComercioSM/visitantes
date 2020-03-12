import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/servicios/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { LocalStorageService } from 'app/servicios/local-storage.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  isAuthb:boolean;
  constructor(public AuthService:AuthService,private LocalStorageService:LocalStorageService){}

  ngOnInit() {

    if (this.LocalStorageService.getDatos('login')=='true') {
      this.isAuthb=true;
     } else{
      this.isAuthb=false;
     }
    //  else {
    // this.AuthService.isAuth().subscribe(user => {
    //   let validado=this.AuthService.getValidado();
    //   if (user ){
    //       console.log(user);
    //       this.isAuthb=true;
    //   }else{
    //     // // console.log('oo ->'+ user);
    //     this.isAuthb=false;
    //   }
    
    // });
    //  }
    }
   
}
