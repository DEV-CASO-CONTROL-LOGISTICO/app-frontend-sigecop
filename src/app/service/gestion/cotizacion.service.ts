import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../util/constant';
import { CotizacionResponse } from '../../model/api/response/CotizacionResponse';
import { CotizacionRequest } from '../../model/api/request/CotizacionRequest';


@Injectable({
    providedIn: 'root'
})
export class CotizacionService {

    constructor(private http: HttpClient) { }

    list(filter: CotizacionRequest): Observable<CotizacionResponse[]> {
        return this.http.post<CotizacionResponse[]>(`${BASE_URL}/cotizacion/list`, filter);
    }

    save(filter: CotizacionRequest): Observable<CotizacionResponse> {
        return this.http.post<CotizacionResponse>(`${BASE_URL}/cotizacion/save`, filter);
    }

    find(filter: CotizacionRequest): Observable<CotizacionResponse> {
        return this.http.post<CotizacionResponse>(`${BASE_URL}/cotizacion/find`, filter);
    }

    delete(id: any): Observable<CotizacionResponse> {
        return this.http.delete<CotizacionResponse>(`${BASE_URL}/solicitud/delete`, {
            body: { id: id }
        });
    }

    aprobar(filter: CotizacionRequest): Observable<any> {
        return this.http.post<any>(`${BASE_URL}/cotizacion/aprobar`, filter);
    }
    
    archivar(filter: CotizacionRequest): Observable<any> {
        return this.http.post<any>(`${BASE_URL}/cotizacion/archivar`, filter);
    }

}