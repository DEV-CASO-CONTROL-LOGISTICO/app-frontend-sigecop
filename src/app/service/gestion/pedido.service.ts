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

}