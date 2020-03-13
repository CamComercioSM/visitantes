import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',     title: 'Estadisticas',         icon:'nc-bank',       class: '' },
    {path: '/visitaProgramada', title:'Visitas Programadas',icon:'nc-tile-56',    class: ''},
    { path: '/table',         title: 'Visitantes',        icon:'nc-tile-56',    class: '' },
    {path:'/VisitaEvento', title: 'Eventos', icon:'nc-tile-56',class:''},
    { path: '/trabajador',     title: 'Trabajadores', icon:'nc-bullet-list-67',class: '' },
    { path: '/registrar',     title: 'Registrar Visitante', icon:'nc-badge',class: '' }
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
