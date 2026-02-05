import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarViewService } from '../services/calendar-view.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalendarComponent, CalendarEventListComponent } from '../features/calendar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CalendarComponent, CalendarEventListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentDay: number = 14;
  private destroy$ = new Subject<void>();

  constructor(private calendarViewService: CalendarViewService) {}

  ngOnInit(): void {
    // Suscribirse al día actual para actualizar el texto del botón
    this.calendarViewService.currentDay$$
      .pipe(takeUntil(this.destroy$))
      .subscribe(day => {
        this.currentDay = day;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDay(): void {
    this.calendarViewService.toggleDay();
  }

  getButtonText(): string {
    // Si el día actual es 14, mostrar "Mostrame el día 15", si es 15, mostrar "Mostrame el día 14"
    return this.currentDay === 14 ? 'Mostrame el día 15' : 'Mostrame el día 14';
  }
}
