import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../util/constant';
import { EstadoPedido } from '../../model/dto/EstadoPedido';


@Injectable({
    providedIn: 'root'
})
export class EstadoPedidoService {

    constructor(private http: HttpClient) { }

    list(filter: EstadoPedido): Observable<EstadoPedido[]> {
        return this.http.post<EstadoPedido[]>(`${BASE_URL}/estado_pedido/list`, filter);
    }

    save(filter: EstadoPedido): Observable<EstadoPedido> {
        return this.http.post<EstadoPedido>(`${BASE_URL}/estado_pedido/save`, filter);
    }

    delete(filter: EstadoPedido): Observable<EstadoPedido> {
        return this.http.delete<EstadoPedido>(`${BASE_URL}/estado_pedido/delete`, {
            body: filter
        });
    }

}