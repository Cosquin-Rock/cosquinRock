import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent, CalendarEventListComponent } from './features/calendar';

export const routes: Routes = [
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
  { path: 'calendar', component: CalendarComponent, data: { title: 'Calendario' } }
  ,
  { path: 'events', component: CalendarEventListComponent, data: { title: 'Eventos' } }
];
