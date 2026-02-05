import { Component } from '@angular/core';
import { CalendarViewService } from '../services/calendar-view.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalendarComponent, CalendarEventListComponent } from '../features/calendar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CalendarComponent, CalendarEventListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private calendarViewService: CalendarViewService) {}

  toggleDay(): void {
    this.calendarViewService.toggleDay();
  }
}
