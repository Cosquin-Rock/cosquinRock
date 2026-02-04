import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  CalendarEventService,
  CreateUpdateEventRequest,
  FullCalendarEvent
} from '../index';

/**
 * Componente ejemplo que muestra cómo usar el CalendarEventService
 * sin necesidad de usar el componente completo de Full Calendar.
 * 
 * Útil si quieres:
 * - Listar eventos en una tabla
 * - Crear un modal para editar eventos
 * - Integrar con otro calendario o librería
 */
@Component({
  selector: 'app-calendar-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar-event-list.component.html',
  styleUrl: './calendar-event-list.component.scss'
})
export class CalendarEventListComponent implements OnInit, OnDestroy {
  events: FullCalendarEvent[] = [];
  isLoading = false;
  isEditing: { [key: string]: boolean } = {};
  errorMessage = '';
  successMessage = '';

  private destroy$ = new Subject<void>();

  constructor(private eventService: CalendarEventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los eventos del servicio
   */
  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.eventService
      .getEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (events) => {
          this.events = events;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error cargando eventos:', error);
          this.errorMessage = 'Error al cargar los eventos';
          this.isLoading = false;
        }
      });
  }

  /**
   * Elimina un evento
   */
  deleteEvent(eventId: string): void {
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      return;
    }

    this.eventService
      .deleteEvent(eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Evento eliminado correctamente';
          this.loadEvents();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error eliminando evento:', error);
          this.errorMessage = 'Error al eliminar el evento';
        }
      });
  }

  /**
   * Alterna el estado de edición de un evento
   */
  toggleEdit(eventId: string): void {
    this.isEditing[eventId] = !this.isEditing[eventId];
  }

  /**
   * Guarda los cambios de un evento
   */
  saveEvent(event: FullCalendarEvent): void {
    const updateRequest: CreateUpdateEventRequest = this.eventService.convertFullCalendarToDB(event);

    this.eventService
      .updateEvent(event.id, updateRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Evento actualizado correctamente';
          this.isEditing[event.id] = false;
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error actualizando evento:', error);
          this.errorMessage = 'Error al actualizar el evento';
        }
      });
  }

  /**
   * Formatea una fecha para mostrar
   */
  formatDate(date: string | Date | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Obtiene el color de fondo del evento
   */
  getEventColor(event: FullCalendarEvent): { backgroundColor: string } {
    return {
      backgroundColor: event.backgroundColor || '#3788d8'
    };
  }

  /**
   * Obtiene la ubicación del evento de forma segura
   */
  getEventLocation(event: FullCalendarEvent): string {
    return event.extendedProps?.location || '-';
  }

  /**
   * Obtiene el estado del evento de forma segura
   */
  getEventStatus(event: FullCalendarEvent): string {
    return event.extendedProps?.status || 'Confirmado';
  }

  /**
   * Maneja cambio de checkbox para todo el día
   */
  onAllDayChange(event: FullCalendarEvent, isChecked: boolean): void {
    event.allDay = isChecked;
  }

  /**
   * Maneja cambio de descripción
   */
  onDescriptionChange(event: FullCalendarEvent, description: string): void {
    if (!event.extendedProps) {
      event.extendedProps = {};
    }
    event.extendedProps['description'] = description;
  }

  /**
   * Maneja cambio de ubicación
   */
  onLocationChange(event: FullCalendarEvent, location: string): void {
    if (!event.extendedProps) {
      event.extendedProps = {};
    }
    event.extendedProps['location'] = location;
  }

  /**
   * Maneja cambio de color
   */
  onColorChange(event: FullCalendarEvent, color: string): void {
    event.backgroundColor = color;
  }
}
