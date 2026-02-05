import { Component } from '@angular/core';
import { CalendarComponent } from '../index';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-defined-calendar',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  template: `<app-calendar></app-calendar>`,
  styles: []
})
export class DefinedCalendarComponent {}
