import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import {
  CalendarEventDB,
  FullCalendarEvent,
  CreateUpdateEventRequest,
  GetEventsResponse,
  EventOperationResponse,
  DeleteEventResponse
} from '../models/calendar-event.interface';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {
  private apiUrl = 'http://localhost:3001/api/events'; // Point to Mockoon running on port 3000
  private events$ = new BehaviorSubject<FullCalendarEvent[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los eventos del backend y los convierte al formato de Full Calendar
   */
  getEvents(): Observable<FullCalendarEvent[]> {
    return this.http.get<GetEventsResponse>(this.apiUrl).pipe(
      map(response => response.data.map(event => this.convertDBToFullCalendar(event))),
      tap(events => this.events$.next(events)),
      catchError(error => {
        console.warn('Failed to fetch events from API, using mock events.', error);
        // Create two mock events for today: 14:00-15:00 and 14:30-15:00
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const date = today.getDate();

            const event1Start = new Date(year, month, date, 14, 0, 0).toISOString();
            const event1End = new Date(year, month, date, 15, 0, 0).toISOString();

            const event2Start = new Date(year, month, date, 14, 30, 0).toISOString();
            const event2End = new Date(year, month, date, 15, 0, 0).toISOString();

            const mockEvents: FullCalendarEvent[] = [
            {
                id: 'mock-1',
                title: 'Reunión de equipo',
                start: event1Start,
                end: event1End,
                backgroundColor: '#3788d8',
                borderColor: '#3788d8',
                textColor: '#fff',
                allDay: false,
                extendedProps: { description: 'Evento simulado 14:00-15:00' }
            },
            {
                id: 'mock-2',
                title: 'Llamada rápida',
                start: event2Start,
                end: event2End,
                backgroundColor: '#ff7f50',
                borderColor: '#ff7f50',
                textColor: '#fff',
                allDay: false,
                extendedProps: { description: 'Evento simulado 14:30-15:00' }
            }
            ];

        this.events$.next(mockEvents);
        return of(mockEvents);
      })
    );
  }

  /**
   * Obtiene los eventos como un observable
   */
  getEventsStream(): Observable<FullCalendarEvent[]> {
    return this.events$.asObservable();
  }

  /**
   * Crea un nuevo evento en el backend
   */
  createEvent(eventRequest: CreateUpdateEventRequest): Observable<FullCalendarEvent> {
    return this.http.post<EventOperationResponse>(this.apiUrl, eventRequest).pipe(
      map(response => this.convertDBToFullCalendar(response.data)),
      tap(newEvent => {
        const currentEvents = this.events$.value;
        this.events$.next([...currentEvents, newEvent]);
      })
    );
  }

  /**
   * Actualiza un evento existente
   */
  updateEvent(eventId: string, eventRequest: CreateUpdateEventRequest): Observable<FullCalendarEvent> {
    return this.http.put<EventOperationResponse>(`${this.apiUrl}/${eventId}`, eventRequest).pipe(
      map(response => this.convertDBToFullCalendar(response.data)),
      tap(updatedEvent => {
        const currentEvents = this.events$.value;
        const index = currentEvents.findIndex(e => e.id === eventId);
        if (index !== -1) {
          currentEvents[index] = updatedEvent;
          this.events$.next([...currentEvents]);
        }
      })
    );
  }

  /**
   * Elimina un evento
   */
  deleteEvent(eventId: string): Observable<DeleteEventResponse> {
    return this.http.delete<DeleteEventResponse>(`${this.apiUrl}/${eventId}`).pipe(
      tap(() => {
        const currentEvents = this.events$.value;
        this.events$.next(currentEvents.filter(e => e.id !== eventId));
      })
    );
  }

  /**
   * Convierte un evento de la base de datos al formato de Full Calendar
   * Adapta las fechas y propiedades extendidas
   */
  private convertDBToFullCalendar(dbEvent: CalendarEventDB): FullCalendarEvent {
    return {
      id: dbEvent.id,
      title: dbEvent.title,
      start: dbEvent.startDate,
      end: dbEvent.endDate,
      backgroundColor: dbEvent.color || '#3788d8',
      borderColor: dbEvent.color || '#3788d8',
      textColor: '#fff',
      allDay: dbEvent.allDay ?? false,
      extendedProps: {
        description: dbEvent.description,
        location: dbEvent.location,
        attendees: dbEvent.attendees,
        status: dbEvent.status,
        color: dbEvent.color
      }
    };
  }

  /**
   * Convierte un evento de Full Calendar al formato de la base de datos
   * Útil para guardar cambios hechos en el calendario
   */
  convertFullCalendarToDB(fcEvent: FullCalendarEvent): CreateUpdateEventRequest {
    return {
      title: fcEvent.title,
      description: fcEvent.extendedProps?.description,
      startDate: typeof fcEvent.start === 'string' ? fcEvent.start : fcEvent.start?.toISOString() || '',
      endDate: typeof fcEvent.end === 'string' ? fcEvent.end : fcEvent.end?.toISOString() || '',
      color: fcEvent.backgroundColor,
      allDay: fcEvent.allDay,
      location: fcEvent.extendedProps?.location,
      attendees: fcEvent.extendedProps?.attendees,
      status: fcEvent.extendedProps?.status as 'confirmed' | 'tentative' | 'cancelled' || 'confirmed'
    };
  }

  /**
   * Recarga los eventos del servidor
   */
  reloadEvents(): Observable<FullCalendarEvent[]> {
    return this.getEvents();
  }
}
