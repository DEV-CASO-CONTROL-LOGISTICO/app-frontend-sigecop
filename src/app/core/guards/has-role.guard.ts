import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, GuardResult, MaybeAsync, Router, UrlTree } from '@angular/router';
import { StorageService } from '../../service/util/storage.service';
import { Pagina } from '../../model/dto/Pagina';

export const hasRoleGuard: CanActivateFn = (route, state): MaybeAsync<GuardResult> => {


  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) return false;

  const requestedUrl = state.url;
  const lastSegment = requestedUrl.split('/').pop();
  const authService = inject(StorageService);
  let session = authService.getUserSession();

  const allowedPages = session?.paginas?.map((x: Pagina) => x.url);
  if (allowedPages && !allowedPages.includes(lastSegment)) {
    return redirectToUnauthorizedPage();
  }
  return true;
};

function redirectToUnauthorizedPage(): UrlTree {
  const router = inject(Router);
  return router.parseUrl('/home/SinAutorizacion');
}
