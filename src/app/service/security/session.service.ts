import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../util/constant';
import { StorageService } from '../util/storage.service';
import { UserResponse } from '../../model/api/response/UserResponse';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(private http: HttpClient, private storageService: StorageService) { }

  /*infoSession(): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${BASE_URL}/session/getInfoSession`, {});
  }*/
}
