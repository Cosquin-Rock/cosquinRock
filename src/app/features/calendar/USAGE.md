/**
 * EJEMPLO DE USO DEL MÓDULO DE CALENDARIO
 * 
 * Este archivo muestra cómo integrar el módulo de calendario en tu aplicación
 */

// ============================================
// 1. IMPORTAR EN TUS RUTAS (app.routes.ts)
// ============================================

import { Routes } from '@angular/router';
import { CalendarComponent } from './features/calendar';

export const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarComponent,
    data: { title: 'Calendario' }
  },
  // ... más rutas
];

// ============================================
// 2. USAR EN TUS COMPONENTES
// ============================================

import { Component } from '@angular/core';
import { CalendarComponent } from '@app/features/calendar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CalendarComponent],
  template: `<app-calendar></app-calendar>`
})
export class DashboardComponent {}

// ============================================
// 3. USAR EL SERVICIO DIRECTAMENTE
// ============================================

import { Component, OnInit } from '@angular/core';
import { CalendarEventService, CreateUpdateEventRequest } from '@app/features/calendar';

@Component({
  selector: 'app-event-form',
  template: `
    <form (ngSubmit)="saveEvent()">
      <input [(ngModel)]="event.title" placeholder="Título del evento" />
      <input type="datetime-local" [(ngModel)]="event.startDate" />
      <button type="submit">Guardar</button>
    </form>
  `
})
export class EventFormComponent implements OnInit {
  event: CreateUpdateEventRequest = {
    title: '',
    startDate: '',
    endDate: ''
  };

  constructor(private eventService: CalendarEventService) {}

  ngOnInit(): void {
    // Cargar eventos
    this.eventService.getEvents().subscribe(events => {
      console.log('Eventos cargados:', events);
    });
  }

  saveEvent(): void {
    this.eventService.createEvent(this.event).subscribe({
      next: (newEvent) => {
        console.log('Evento creado:', newEvent);
        this.event = { title: '', startDate: '', endDate: '' };
      },
      error: (err) => console.error('Error:', err)
    });
  }
}

// ============================================
// 4. ESTRUCTURA DE RESPUESTA DEL BACKEND
// ============================================

/*
GET /api/events
Response:
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Reunión",
      "description": "Reunión con el equipo",
      "startDate": "2024-02-03T10:00:00Z",
      "endDate": "2024-02-03T11:00:00Z",
      "color": "#3788d8",
      "allDay": false,
      "location": "Sala de conferencias",
      "attendees": ["user1@example.com", "user2@example.com"],
      "status": "confirmed",
      "createdAt": "2024-01-20T08:00:00Z",
      "updatedAt": "2024-01-20T08:00:00Z"
    }
  ],
  "timestamp": "2024-02-03T12:00:00Z"
}

POST /api/events
Request:
{
  "title": "Nuevo evento",
  "description": "Descripción",
  "startDate": "2024-02-03T14:00:00Z",
  "endDate": "2024-02-03T15:00:00Z",
  "color": "#FF5733",
  "allDay": false,
  "location": "Online",
  "attendees": ["user1@example.com"],
  "status": "confirmed"
}

Response:
{
  "success": true,
  "data": { ...evento creado },
  "timestamp": "2024-02-03T12:00:00Z"
}

PUT /api/events/:id
Request: (mismo formato que POST)

DELETE /api/events/:id
Response:
{
  "success": true,
  "message": "Evento eliminado",
  "timestamp": "2024-02-03T12:00:00Z"
}
*/

// ============================================
// 5. PERSONALIZAR COLORES Y ESTILOS
// ============================================

/*
En el componente CalendarComponent, puedes modificar calendarOptions:

this.calendarOptions.set({
  ...this.calendarOptions(),
  eventColor: '#3788d8',
  eventBackgroundColor: '#3788d8',
  eventBorderColor: '#2c6ab1',
  eventTextColor: '#ffffff',
  // Más opciones en: https://fullcalendar.io/docs
});
*/

// ============================================
// 6. HORARIOS Y ZONAS HORARIAS
// ============================================

/*
Full Calendar soporta zonas horarias. Para usarlas:

import { Calendar } from '@fullcalendar/core';

this.calendarOptions.set({
  ...this.calendarOptions(),
  timeZone: 'America/Argentina/Buenos_Aires',
  // O tu zona horaria preferida
});

Para convertir fechas con zona horaria en el servicio:
const dateWithTz = new Date('2024-02-03T10:00:00').toLocaleString('es-AR', { 
  timeZone: 'America/Argentina/Buenos_Aires' 
});
*/

// ============================================
// 7. PERSISTENCIA Y SINCRONIZACIÓN
// ============================================

/*
El servicio usa BehaviorSubject para mantener los eventos en memoria.
Cuando haces cambios (crear, actualizar, eliminar), se sincronizan automáticamente.

Para resetear/recargar:
this.eventService.reloadEvents().subscribe(events => {
  console.log('Eventos recargados del servidor');
});
*/

// ============================================
// 8. CARACTERÍSTICAS AVANZADAS
// ============================================

/*
- Drag & drop: Editable = true (ya configurado)
- Seleccionar rangos: Selectable = true (ya configurado)
- Eventos recurrentes: Requiere lógica backend personalizada
- Múltiples calendarios: Crear múltiples instancias del componente
- Exportar a iCal: Requiere librería adicional como 'ics-js'
*/

export {};
