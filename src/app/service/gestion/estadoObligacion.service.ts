import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../util/constant';
import { EstadoSolicitud } from '../../model/dto/EstadoSolicitud';
import { EstadoObligacion } from '../../model/dto/EstadoObligacion';


@Injectable({
    providedIn: 'root'
})
export class EstadoObligacionService {

    constructor(private http: HttpClient) { }

    list(filter: EstadoObligacion): Observable<EstadoObligacion[]> {
        return this.http.post<EstadoObligacion[]>(`${BASE_URL}/estado_obligacion/list`, filter);
    }

    save(filter: EstadoObligacion): Observable<EstadoObligacion> {
        return this.http.post<EstadoSolicitud>(`${BASE_URL}/estado_obligacion/save`, filter);
    }

    delete(filter: EstadoObligacion): Observable<EstadoObligacion> {
        return this.http.delete<EstadoObligacion>(`${BASE_URL}/estado_obligacion/delete`, {
            body: filter
        });
    }

}