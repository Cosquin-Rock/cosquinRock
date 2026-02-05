import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CalendarViewService {
  // 14 by default
  private currentDay$ = new BehaviorSubject<number>(14);
  currentDay$$ = this.currentDay$.asObservable();

  showDay14(): void { this.currentDay$.next(14); }
  showDay15(): void { this.currentDay$.next(15); }
  toggleDay(): void {
    const next = this.currentDay$.getValue() === 14 ? 15 : 14;
    this.currentDay$.next(next);
  }
}
