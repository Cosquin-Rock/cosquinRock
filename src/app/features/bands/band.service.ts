import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Band {
  id: number;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  color?: string;
  allDay?: boolean;
  location?: string;
  attendees?: string[];
  status?: string;
  selected?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BandsResponse {
  success: boolean;
  data: Band[];
  message?: string;
  timestamp?: string;
  person?: string;
}

@Injectable({ providedIn: 'root' })
export class BandService {
  private apiUrl = 'http://localhost:3000/api/getBands';
  constructor(private http: HttpClient) {}

  getBands(): Observable<Band[]> {
    return this.http.get<BandsResponse>(this.apiUrl).pipe(
      map((response: BandsResponse) => {
        return response?.data ?? [];
      }),
      catchError((err: any) => {
        console.warn('Error fetching bands from backend', err);
        return of<Band[]>([]);
      })
    );
  }
}
