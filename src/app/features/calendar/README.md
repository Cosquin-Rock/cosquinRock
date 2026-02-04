# Módulo de Calendario (Calendar Module)

## Descripción

Este módulo proporciona una solución completa de calendario para CosquinRock usando Full Calendar. Incluye:

- ✅ Componente de calendario standalone
- ✅ Servicio de gestión de eventos
- ✅ Interfaces TypeScript tipadas
- ✅ Conversión automática entre formatos DB ↔ Full Calendar
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Compatible con SSR

## Estructura del Proyecto

```
src/app/features/calendar/
├── models/
│   └── calendar-event.interface.ts       # Interfaces y tipos
├── services/
│   ├── calendar-event.service.ts         # Lógica de API
│   └── calendar-event.service.spec.ts    # Tests
├── components/
│   ├── calendar.component.ts             # Componente principal
│   ├── calendar.component.html           # Template
│   └── calendar.component.scss           # Estilos
├── index.ts                              # Barrel export
├── README.md                             # Este archivo
└── USAGE.md                              # Ejemplos de uso
```

## Instalación

### 1. Las dependencias ya están instaladas:

```bash
npm install @fullcalendar/angular @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/list @fullcalendar/core
```

### 2. HttpClient ya está configurado en:
- `src/app/app.config.ts` (cliente)
- `src/app/app.config.server.ts` (servidor SSR)

## Uso Básico

### En tus rutas (app.routes.ts):

```typescript
import { CalendarComponent } from './features/calendar';

export const routes: Routes = [
  { path: 'calendar', component: CalendarComponent }
];
```

### En cualquier componente:

```typescript
import { Component } from '@angular/core';
import { CalendarComponent } from '@app/features/calendar';

@Component({
  standalone: true,
  imports: [CalendarComponent],
  template: '<app-calendar></app-calendar>'
})
export class MyComponent {}
```

## Interfaces

### CalendarEventDB
Estructura para guardar en base de datos:
```typescript
{
  id: string;
  title: string;
  description?: string;
  startDate: string;        // ISO 8601
  endDate: string;          // ISO 8601
  color?: string;           // Hex color
  allDay?: boolean;
  location?: string;
  attendees?: string[];
  status?: 'confirmed' | 'tentative' | 'cancelled';
}
```

### FullCalendarEvent
Estructura que usa Full Calendar:
```typescript
{
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  backgroundColor?: string;
  textColor?: string;
  extendedProps?: {
    description?: string;
    location?: string;
    attendees?: string[];
    // ... otras propiedades
  };
}
```

## API del Servicio

### CalendarEventService

```typescript
// Obtener todos los eventos
getEvents(): Observable<FullCalendarEvent[]>

// Obtener como stream (para observar cambios)
getEventsStream(): Observable<FullCalendarEvent[]>

// Crear evento
createEvent(request: CreateUpdateEventRequest): Observable<FullCalendarEvent>

// Actualizar evento
updateEvent(eventId: string, request: CreateUpdateEventRequest): Observable<FullCalendarEvent>

// Eliminar evento
deleteEvent(eventId: string): Observable<DeleteEventResponse>

// Convertir DB → Full Calendar (automático)
private convertDBToFullCalendar(dbEvent: CalendarEventDB): FullCalendarEvent

// Convertir Full Calendar → DB (para guardar cambios)
convertFullCalendarToDB(fcEvent: FullCalendarEvent): CreateUpdateEventRequest

// Recargar eventos del servidor
reloadEvents(): Observable<FullCalendarEvent[]>
```

## Endpoints del Backend Esperados

El servicio asume que tu backend tiene estos endpoints:

```
GET    /api/events           # Obtener todos
POST   /api/events           # Crear
PUT    /api/events/:id       # Actualizar
DELETE /api/events/:id       # Eliminar
```

### Ejemplo de respuesta GET /api/events:

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Reunión importante",
      "startDate": "2024-02-03T10:00:00Z",
      "endDate": "2024-02-03T11:00:00Z",
      "color": "#3788d8",
      "allDay": false,
      "location": "Sala A",
      "status": "confirmed"
    }
  ],
  "timestamp": "2024-02-03T12:00:00Z"
}
```

## Características

### ✅ Vistas Disponibles
- Mes
- Semana
- Día
- Lista

### ✅ Interacciones
- **Crear evento**: Click en una fecha
- **Editar evento**: Click en evento existente
- **Arrastra y suelta**: Cambiar hora/fecha de eventos
- **Seleccionar rango**: Para crear eventos en múltiples días

### ✅ Almacenamiento
- Los eventos se sincronizan automáticamente con el backend
- BehaviorSubject mantiene el estado en tiempo real
- Compatible con SSR (se ejecuta en cliente después de hidratación)

## Estilos

Los estilos se encuentran en `calendar.component.scss`:
- Tema azul por defecto (#3788d8)
- Responsive para móvil
- Diseño limpio y moderno

Para personalizar:
1. Modifica los colores en `calendar.component.scss`
2. O pasa opciones diferentes a `calendarOptions.set()`

## Testing

Tests unitarios incluidos en `calendar-event.service.spec.ts`:

```bash
npm test -- --include='**/calendar-event.service.spec.ts'
```

## SSR (Server-Side Rendering)

⚠️ **Importante**: Full Calendar es una librería de cliente. Para SSR:

1. El calendario se renderiza SOLO en cliente
2. Los datos se obtienen del servidor durante la hidratación
3. No hay problemas de DOM en servidor (se ejecuta con `isPlatformBrowser`)

**Nota**: Si necesitas pre-renderizar eventos en el servidor, deberías:
- Crear un componente separado para la lista de eventos
- O usar prerendering en build time

## Personalización Avanzada

### Cambiar zona horaria:
```typescript
// En calendar.component.ts
calendarOptions = signal<CalendarOptions>({
  ...this.calendarOptions(),
  timeZone: 'America/Argentina/Buenos_Aires'
});
```

### Cambiar colores dinámicamente:
```typescript
// En calendar.component.ts
updateEventColor(eventId: string, color: string): void {
  // Lógica personalizada
}
```

### Agregar eventos recurrentes:
Requiere lógica backend. En el componente:
```typescript
// El backend debe retornar múltiples instancias del evento recurrente
// O usar la biblioteca rrule de Full Calendar
```

## Troubleshooting

### El calendario no se ve
- Asegúrate de haber importado FullCalendarModule en el componente
- Verifica que Full Calendar CSS se incluya (debería ser automático)

### Los eventos no se cargan
- Verifica que el backend esté disponible
- Comprueba la URL del API en `calendar-event.service.ts` (línea 16)
- Abre la consola del navegador para ver errores HTTP

### Errores de SSR
- Full Calendar debería funcionar en cliente sin problemas
- Si tienes errores, asegúrate de que `isPlatformBrowser` se use correctamente

### Zona horaria incorrecta
- Las fechas se guardan en UTC (Z) en el backend
- Asegúrate de convertir correctamente en client/servidor según sea necesario

## Próximas Mejoras

- [ ] Integración con Google Calendar / Outlook
- [ ] Eventos recurrentes
- [ ] Múltiples calendarios
- [ ] Exportar a iCal / PDF
- [ ] Notificaciones de eventos
- [ ] Compartir calendarios

## Resources

- [Full Calendar Documentation](https://fullcalendar.io/)
- [Full Calendar Angular Integration](https://fullcalendar.io/docs/angular)
- [Full Calendar Events Docs](https://fullcalendar.io/docs/event-object)

---

**Versión**: 1.0.0  
**Última actualización**: Feb 3, 2026  
**Estado**: ✅ Producción
