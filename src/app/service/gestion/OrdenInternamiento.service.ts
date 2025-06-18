import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrdenInternamientoRequest } from '../../model/api/request/OrdenInternamientoRequest';
import { OrdenInternamientoResponse } from '../../model/api/response/OrdenInternamientoResponse';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../util/constant';

@Injectable({
  providedIn: 'root'
})
export class OrdenInternamientoService {

  constructor(private http: HttpClient) { }

  list(filter: OrdenInternamientoRequest): Observable<OrdenInternamientoResponse[]> {
          return this.http.post<OrdenInternamientoResponse[]>(`${BASE_URL}/pedido/list`, filter);
  }
  
  save(filter: OrdenInternamientoRequest): Observable<OrdenInternamientoResponse> {
          return this.http.post<OrdenInternamientoResponse>(`${BASE_URL}/pedido/save`, filter);
  }
  
  find(filter: OrdenInternamientoRequest): Observable<OrdenInternamientoResponse> {
          return this.http.post<OrdenInternamientoResponse>(`${BASE_URL}/pedido/find`, filter);
  }
}
