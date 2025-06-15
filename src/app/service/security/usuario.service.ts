import { Injectable } from '@angular/core';
import { BASE_URL } from '../../util/constant';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserResponse } from '../../model/api/response/UserResponse';
import { UserRequest } from '../../model/api/request/UserRequest';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  list(filter: UserRequest): Observable<UserResponse[]> {
    return this.http.post<UserResponse[]>(`${BASE_URL}/usuario/list`, filter);
  }

  save(filter: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${BASE_URL}/usuario/save`, filter);
  }

  delete(filter: UserRequest): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${BASE_URL}/usuario/delete`, {
      body: filter
    });
  }
  find(filter: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${BASE_URL}/usuario/find`, filter);
  }

}
