import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarEventService } from '../services/calendar-event.service';
import { CalendarViewService } from '../../../services/calendar-view.service';
import { isPlatformBrowser } from '@angular/common';
import type { CalendarOptions } from '@fullcalendar/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  currentDay: number = 14;
  calendarOptions14: CalendarOptions = {} as CalendarOptions;
  calendarOptions15: CalendarOptions = {} as CalendarOptions;
  private destroy$ = new Subject<void>();
  pluginsReady14 = false;
  pluginsReady15 = false;

  /** Paleta de colores por escenario (referencia) */
  locationColors: { location: string; color: string }[] = [
    { location: 'sur', color: '#79D8B2' },
    { location: 'montana', color: '#FF5D38' },
    { location: 'Paraguay????', color: '#6E1F98' },
    { location: 'La FKN Casita del maldito blues', color: '#FFBD42' },
    { location: 'La plaza electronic stage', color: '#FFB8C1' },
    { location: 'Sorpresa', color: '#F3F7A1' },
    { location: 'Norte', color: '#690571' },
    { location: 'Boomerang', color: '#3788d8' },
  ];

  constructor(
    private calendarEventService: CalendarEventService,
    private calendarViewService: CalendarViewService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Initialize two calendar options with loaded plugins to avoid SSR issues
    const plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];
    this.calendarOptions14 = {
      initialView: 'timeGridDay',
      initialDate: '2026-02-14',
      headerToolbar: { left: '', center: '', right: '' },
      timeZone: 'America/Argentina/Buenos_Aires',
      weekends: true,
      editable: false,
      selectable: false,
      events: [],
      eventDisplay: 'block',
      displayEventTime: true,
      slotMinTime: '14:00:00',
      slotMaxTime: '27:00:00',
      slotDuration: '00:30:00',
      nowIndicator: true,
      height: 'auto',
      allDaySlot: false, // Ocultar la fila "all-day"
      plugins,
      eventContent: this.getEventContentLeft.bind(this)
    } as CalendarOptions;

    this.calendarOptions15 = {
      initialView: 'timeGridDay',
      initialDate: '2026-02-15',
      headerToolbar: { left: '', center: '', right: '' },
      timeZone: 'America/Argentina/Buenos_Aires',
      weekends: true,
      editable: false,
      selectable: false,
      events: [],
      eventDisplay: 'block',
      displayEventTime: true,
      slotMinTime: '14:00:00',
      slotMaxTime: '27:00:00',
      slotDuration: '00:30:00',
      nowIndicator: true,
      height: 'auto',
      allDaySlot: false, // Ocultar la fila "all-day"
      plugins,
      eventContent: this.getEventContentRight.bind(this)
    } as CalendarOptions;

    this.pluginsReady14 = true;
    this.pluginsReady15 = true;
    
    // Solo cargar eventos en el navegador, no en el servidor (SSR)
    if (isPlatformBrowser(this.platformId)) {
      this.loadEvents();
      
      // Subscribe to Day toggle if service is available
      if ((this as any).calendarViewService !== undefined) {
        try {
          (this.calendarViewService as any).currentDay$$?.subscribe((d: number) => {
            this.currentDay = d;
          });
        } catch (e) {
          // ignore if not available
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEvents(): void {
    console.log('🔄 Cargando eventos desde el navegador...');
    this.calendarEventService.getEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (events) => {
          console.log('✅ Eventos cargados:', events);
          const evs = events as any[];
          (this.calendarOptions14 as any).events = evs;
          (this.calendarOptions15 as any).events = evs;
        },
        error: (error) => {
          console.error('❌ Error al cargar eventos:', error);
        }
      });
  }

  getEventContentLeft(arg: any) {
    const e = arg.event;
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'flex-start';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.color = '#fff';
    container.style.fontFamily = "'Psychedelic One', cursive";
    container.style.padding = '4px 6px';
    container.style.boxSizing = 'border-box';

    const headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.justifyContent = 'space-between';
    headerRow.style.alignItems = 'flex-start';
    headerRow.style.width = '100%';
    headerRow.style.gap = '8px';

    const title = document.createElement('div');
    title.textContent = e.title;
    title.style.fontSize = '1.05em';
    title.style.fontWeight = 'bold';
    title.style.textTransform = 'uppercase';
    title.style.flex = '1';
    title.style.minWidth = '0';
    headerRow.appendChild(title);

    const time = document.createElement('div');
    time.textContent = arg.timeText ?? '';
    time.style.fontSize = '0.75em';
    time.style.fontWeight = '400';
    time.style.flexShrink = '0';
    headerRow.appendChild(time);

    container.appendChild(headerRow);

    const location = document.createElement('div');
    location.textContent = e.extendedProps?.location ?? '';
    location.style.fontSize = '1em';
    location.style.fontWeight = '600';
    location.style.marginTop = '4px';
    container.appendChild(location);

    const firstAttendee = e.extendedProps?.attendees?.[0];
    if (firstAttendee) {
      const band = document.createElement('div');
      band.textContent = firstAttendee;
      band.style.fontSize = '0.9em';
      band.style.marginTop = '2px';
      container.appendChild(band);
    }

    return { domNodes: [container] };
  }

  getEventContentRight = this.getEventContentLeft;
}
