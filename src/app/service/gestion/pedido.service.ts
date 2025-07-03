import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../util/constant';
import { PedidoResponse } from '../../model/api/response/PedidoResponse';
import { PedidoRequest } from '../../model/api/request/PedidoRequest';


@Injectable({
    providedIn: 'root'
})
export class PedidoService {

    constructor(private http: HttpClient) { }

    list(filter: PedidoRequest): Observable<PedidoResponse[]> {
        return this.http.post<PedidoResponse[]>(`${BASE_URL}/pedido/list`, filter);
    }

    save(filter: PedidoRequest): Observable<PedidoResponse> {
        return this.http.post<PedidoResponse>(`${BASE_URL}/pedido/save`, filter);
    }

    find(filter: PedidoRequest): Observable<PedidoResponse> {
        return this.http.post<PedidoResponse>(`${BASE_URL}/pedido/find`, filter);
    }

    finalizar(filter: PedidoRequest): Observable<any> {
        return this.http.post<any>(`${BASE_URL}/pedido/finalizar`, filter);
    }

    delete(id: any): Observable<PedidoResponse> {
        return this.http.delete<PedidoResponse>(`${BASE_URL}/pedido/delete`, {
            body: { id: id }
        });
    }
    enviarPedido(filter: PedidoRequest): Observable<PedidoResponse> {
        return this.http.post<PedidoResponse>(`${BASE_URL}/pedido/enviar`, filter);
    }

    findByProveedor(filter: PedidoRequest): Observable<PedidoResponse[]> {
        return this.http.post<PedidoResponse[]>(`${BASE_URL}/pedido/pedidoProveedor`, filter);
    }

    darConformidad(filter: PedidoRequest): Observable<PedidoResponse> {
        return this.http.post<PedidoResponse>(`${BASE_URL}/pedido/darConformidad`, filter);
    }

    devolver(filter: PedidoRequest): Observable<PedidoResponse> {
        return this.http.post<PedidoResponse>(`${BASE_URL}/pedido/devolver`, filter);
    }

    enviarArchivoFactura(formData: FormData): Observable<any> {
        return this.http.post<any>(`${BASE_URL}/pedido/uploadFactura`, formData);
    }

    enviarArchivoGuia(formData: FormData): Observable<any> {
        return this.http.post<any>(`${BASE_URL}/pedido/uploadGuia`, formData);
    }
    
    descargarArchivoFactura(filter: PedidoRequest): Observable<Blob> {
        return this.http.post(`${BASE_URL}/pedido/downloadFactura`, filter,{ responseType: 'blob' });
    }

    descargarArchivoGuia(filter: PedidoRequest): Observable<Blob> {
        return this.http.post(`${BASE_URL}/pedido/downloadGuia`, filter,{ responseType: 'blob' });
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

}