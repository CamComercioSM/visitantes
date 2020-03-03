import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';

import { TableComponent } from '../../pages/table/table.component';
import { RegistrarComponent } from '../../pages/registrar/registrar.component';
import { TrabajadorComponent } from 'app/pages/trabajador/trabajador.component';
import { LoginComponent } from 'app/pages/login/login.component';
import { VisitaProgramadaComponent } from '../../pages/visita-programada/visita-programada.component';
import { VisitaEventoComponent } from 'app/pages/visita-evento/visita-evento.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'table', component: TableComponent },
    { path: 'registrar', component: RegistrarComponent },
    { path: 'trabajador', component: TrabajadorComponent },
    { path: 'visitaProgramada', component: VisitaProgramadaComponent },
    { path: 'VisitaEvento', component: VisitaEventoComponent },
];
