import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../service/util/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private storageService: StorageService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const excludedPaths = [
            '/session/login'
        ];

        const shouldExclude = excludedPaths.some(path => req.url.includes(path));
        if (shouldExclude) {
            return next.handle(req); // No modifica la request
        }

        const token = this.storageService.getToken();

        if (token) {
            const cloned = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(cloned);
        }

        return next.handle(req);
    }
}
