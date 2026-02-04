import { Component, OnInit, OnDestroy, signal, Inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarEventService } from '../services/calendar-event.service';
import { FullCalendarEvent, CreateUpdateEventRequest } from '../models/calendar-event.interface';
import { isPlatformBrowser } from '@angular/common';
import type { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, OnDestroy {
  // Two calendars will be rendered side by side; we manage two option sets below

  calendarOptionsLeft = signal<any>({
    // Fix the view to a single day and lock navigation
    initialView: 'timeGridDay',
    initialDate: '2026-02-14',
    headerToolbar: {
      left: '',
      center: '',
      right: ''
    },
    timeZone: 'America/Argentina/Buenos_Aires',
    weekends: true,
    // Lock editing to prevent moving days, weeks, etc.
    editable: false,
    selectable: false,
    events: [],
    eventDisplay: 'block',
    displayEventTime: true,
    // Time grid specific options
    allDaySlot: false,
    slotMinTime: '15:00:00',
    slotMaxTime: '26:00:00',
    slotDuration: '00:30:00',
    nowIndicator: true,
    height: 'auto',
  });

  calendarOptionsRight = signal<any>({
    initialView: 'timeGridDay',
    initialDate: '2026-02-15',
    headerToolbar: {
      left: '',
      center: '',
      right: ''
    },
    timeZone: 'America/Argentina/Buenos_Aires',
    weekends: true,
    editable: false,
    selectable: false,
    events: [],
    eventDisplay: 'block',
    displayEventTime: true,
    allDaySlot: false,
    slotMinTime: '15:00:00',
    slotMaxTime: '26:00:00',
    slotDuration: '00:30:00',
    nowIndicator: true,
    height: 'auto',
  });
  isLoading = signal(false);
  pluginsLoadedLeft = signal(false);
  pluginsLoadedRight = signal(false);
  private destroy$ = new Subject<void>();

  constructor(
    private calendarEventService: CalendarEventService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      // Left calendar plugins
      import('@fullcalendar/daygrid').then(({ default: dayGridPlugin }) => {
        import('@fullcalendar/timegrid').then(({ default: timeGridPlugin }) => {
          import('@fullcalendar/interaction').then(({ default: interactionPlugin }) => {
            const optionsLeft: any = { ...this.calendarOptionsLeft() };
            optionsLeft.plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];
            this.calendarOptionsLeft.set(optionsLeft);
            this.pluginsLoadedLeft.set(true);
          });
        });
      });

      // Right calendar plugins
      import('@fullcalendar/daygrid').then(({ default: dayGridPlugin }) => {
        import('@fullcalendar/timegrid').then(({ default: timeGridPlugin }) => {
          import('@fullcalendar/interaction').then(({ default: interactionPlugin }) => {
            const optionsRight: any = { ...this.calendarOptionsRight() };
            optionsRight.plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];
            this.calendarOptionsRight.set(optionsRight);
            this.pluginsLoadedRight.set(true);
          });
        });
      });
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadEvents();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los eventos desde el servicio
   */
  loadEvents(): void {
    this.isLoading.set(true);
    this.calendarEventService
      .getEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (events) => {
          const updatedLeft = { ...this.calendarOptionsLeft() };
          updatedLeft.events = events;
          this.calendarOptionsLeft.set(updatedLeft);
          const updatedRight = { ...this.calendarOptionsRight() };
          updatedRight.events = events;
          this.calendarOptionsRight.set(updatedRight);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error cargando eventos:', error);
          this.isLoading.set(false);
        }
      });
  }

  /**
   * Maneja el click en un evento existente
   */
  handleEventClick(arg: any): void {
    const event = arg.event;
    const updatedTitle = prompt('Nuevo título del evento:', event.title);
    if (updatedTitle && updatedTitle !== event.title) {
      const updateRequest: CreateUpdateEventRequest = {
        title: updatedTitle,
        description: event.extendedProps?.['description'] as string | undefined,
        startDate: event.start?.toISOString() || '',
        endDate: event.end?.toISOString() || '',
        color: event.backgroundColor,
        allDay: event.allDay,
        location: event.extendedProps?.['location'] as string | undefined,
        attendees: event.extendedProps?.['attendees'] as string[] | undefined,
        status: event.extendedProps?.['status'] as 'confirmed' | 'tentative' | 'cancelled' | undefined
      };

      this.calendarEventService
        .updateEvent(event.id, updateRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('Evento actualizado');
          },
          error: (error) => {
            console.error('Error actualizando evento:', error);
            alert('Error al actualizar el evento');
          }
        });
    }
  }

  /**
   * Maneja la selección de un rango de fechas (crear nuevo evento)
   */
  handleDateSelect(arg: any): void {
    const title = prompt('Nuevo Evento:');
    if (title) {
      const createRequest: CreateUpdateEventRequest = {
        title: title,
        startDate: arg.start.toISOString(),
        endDate: arg.end.toISOString(),
        allDay: arg.allDay,
        color: '#3788d8'
      };

      this.calendarEventService
        .createEvent(createRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (newEvent) => {
            console.log('Evento creado:', newEvent);
          },
          error: (error) => {
            console.error('Error creando evento:', error);
            alert('Error al crear el evento');
          }
        });
    }
  }

  /**
   * Refresca los eventos desde el servicio
   */
  refreshEvents(): void {
    this.loadEvents();
  }
}
