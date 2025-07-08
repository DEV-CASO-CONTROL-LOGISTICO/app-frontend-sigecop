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

    changeStatus(filter: ObligacionRequest): Observable<ObligacionResponse> {
            return this.http.post<ObligacionResponse>(`${BASE_URL}/obligacion/changeEstado`, filter);
    }

}