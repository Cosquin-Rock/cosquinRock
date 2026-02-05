import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './features/calendar';
import { ClientSelectComponent } from './features/bands/client-select/client-select.component';

export const routes: Routes = [
  { path: '', redirectTo: '/clientSelect', pathMatch: 'full' },
  { path: 'clientSelect', component: ClientSelectComponent, data: { title: 'Selección de Cliente' } },
  { path: 'calendar', component: CalendarComponent, data: { title: 'Calendario' } },
  { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
];
