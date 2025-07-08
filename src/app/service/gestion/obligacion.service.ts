import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../util/constant';
import { ObligacionRequest } from '../../model/api/request/ObligacionRequest';
import { ObligacionResponse } from '../../model/api/response/ObligacionResponse';


@Injectable({
    providedIn: 'root'
})
export class ObligacionService {

    constructor(private http: HttpClient) { }

    list(filter: ObligacionRequest): Observable<ObligacionResponse[]> {
        return this.http.post<ObligacionResponse[]>(`${BASE_URL}/obligacion/list`, filter);
    }

    save(filter: ObligacionRequest): Observable<ObligacionResponse> {
        return this.http.post<ObligacionResponse>(`${BASE_URL}/obligacion/save`, filter);
    }

    find(filter: ObligacionRequest): Observable<ObligacionResponse> {
        return this.http.post<ObligacionResponse>(`${BASE_URL}/obligacion/find`, filter);
    }

    delete(id: any): Observable<ObligacionResponse> {
        return this.http.delete<ObligacionResponse>(`${BASE_URL}/obligacion/delete`, {
            body: { id: id }
        });
    }

    verFactura(pedidoId: number): Observable<Blob> {
        return this.http.get(`${BASE_URL}/pedido/obtenerFactura/${pedidoId}`, {
        responseType: 'blob'
        });
    }

    verGuia(pedidoId: number): Observable<Blob> {
        return this.http.get(`${BASE_URL}/pedido/obtenerGuia/${pedidoId}`, {
        responseType: 'blob'
        });
    }

    registrarPago(data: any): Observable<any> {
        return this.http.post(`${BASE_URL}/obligacion/registrar-pago`, data);
    }


}