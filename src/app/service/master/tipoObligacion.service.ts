import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BASE_URL } from '../../util/constant';
import { TipoObligacion } from '../../model/dto/TipoObligacion';

@Injectable({
  providedIn: 'root'
})
export class TipoObligacionService {

  constructor(private http: HttpClient) { }

  list(filter: TipoObligacion): Observable<TipoObligacion[]> {
          return this.http.post<TipoObligacion[]>(`${BASE_URL}/tipo_obligacion/list`, filter);
  }
  
  save(filter: TipoObligacion): Observable<TipoObligacion> {
          return this.http.post<TipoObligacion>(`${BASE_URL}/tipo_obligacion/save`, filter);
  }
  
  delete(filter: TipoObligacion): Observable<TipoObligacion> {
          return this.http.delete<TipoObligacion>(`${BASE_URL}/tipo_obligacion/delete`, {
              body: filter
          });
  }
}
