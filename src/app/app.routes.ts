import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './features/calendar';
import { ClientSelectComponent } from './features/bands/client-select/client-select.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
  { path: 'calendar', component: CalendarComponent, data: { title: 'Calendario' } },
  { path: 'clientSelect', component: ClientSelectComponent, data: { title: 'Client Select' } },
];
