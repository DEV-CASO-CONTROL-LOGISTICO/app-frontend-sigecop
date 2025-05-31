import { CanMatchFn, GuardResult, MaybeAsync, Router, UrlTree } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { StorageService } from '../../service/util/storage.service';
import { Pagina } from '../../model/dto/Pagina';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanMatchFn = (
  route,
  segments
): MaybeAsync<GuardResult> => {

  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) return false;

  const authService = inject(StorageService);
  let session = authService.getUserSession();

  if (!session || !session.id) {
    return redirectUnauthorizedToLogin();
  }
  return true;
};

function redirectUnauthorizedToLogin(): UrlTree {
  const router = inject(Router);
  return router.parseUrl('/login');
}