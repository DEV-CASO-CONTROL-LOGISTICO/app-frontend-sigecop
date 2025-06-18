import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoInternamiento } from '../../model/dto/TipoInternamiento';
import { Observable } from 'rxjs/internal/Observable';
import { BASE_URL } from '../../util/constant';

@Injectable({
  providedIn: 'root'
})
export class TipoInternamientoService {

  constructor(private http: HttpClient) { }

  list(filter: TipoInternamiento): Observable<TipoInternamiento[]> {
          return this.http.post<TipoInternamiento[]>(`${BASE_URL}/tipo/list`, filter);
  }
  
  save(filter: TipoInternamiento): Observable<TipoInternamiento> {
          return this.http.post<TipoInternamiento>(`${BASE_URL}/tipo/save`, filter);
  }
  
  delete(filter: TipoInternamiento): Observable<TipoInternamiento> {
          return this.http.delete<TipoInternamiento>(`${BASE_URL}/tipo/delete`, {
              body: filter
          });
  }
}
