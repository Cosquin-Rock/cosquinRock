import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface BandPayload {
  id?: number;
  title?: string;
}

export interface SaveBandsRequest {
  bands: any[];
  person: string;
}

@Injectable({ providedIn: 'root' })
export class BandSelectionService {
  private url = `${environment.baseUrl}/api/bandByPerson`;
  constructor(private http: HttpClient) {}

  saveBands(payload: SaveBandsRequest): Observable<any> {
    return this.http.post<any>(this.url, payload).pipe(map((res: any) => res));
  }
}
