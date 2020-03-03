import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';

import { TableComponent }           from '../../pages/table/table.component';
import { VisitaEventoComponent } from '../../pages/visita-evento/visita-evento.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegistrarComponent } from '../../pages/registrar/registrar.component';
import { TrabajadorComponent } from '../../pages/trabajador/trabajador.component';
import {VisitaProgramadaComponent} from '../../pages/visita-programada/visita-programada.component';
import { HttpClientModule } from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import { FiltroPipe } from '../../pipes/filtro.pipe';
import { LoginComponent } from 'app/pages/login/login.component';

import {environment} from './../../../environments/environment';

import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import "firebase/firestore";
import  "firebase/auth";
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
  ],
  declarations: [
    DashboardComponent,
    TableComponent,
    RegistrarComponent,
    TrabajadorComponent,
    VisitaProgramadaComponent,
    FiltroPipe,
    VisitaEventoComponent
    // LoginComponent,
  ],

  providers: [AngularFireAuth, AngularFirestore],
})

export class AdminLayoutModule {}
