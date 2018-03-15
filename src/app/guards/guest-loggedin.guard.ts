import '../misc/observable-case';

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { logger } from '../misc/console-logging';
import { AuthService } from '../services/auth.service';
import { RedirectingService } from '../services/redirecting.service';

// import { doCase } from '../misc/observable-case';
@Injectable()
export class GuestLoggedinGuard implements CanActivateChild {
  constructor(
    private redirect: RedirectingService,
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //
    const isIn = this.authService.isLoggedIn;
    const result = () => false;

    logger.guard(
      'GuestLoggedinGuard -',
      state.url,
      route.routeConfig,
      '| is logged in:',
      isIn,
    );

    if (!isIn) {
      // return false;
      this.redirect.toPublicDomain('loggedin guard bounce back');
      // .then(result, result);
      return false;
    }

    return true;
  }
}
