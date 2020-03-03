import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'registrar',
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
},
  {
    path:'registrar',
    component:AdminLayoutComponent
  },
  {
    path: '**',
    redirectTo: 'registrar'
  }

]
