import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { logger } from '../misc/console-logging';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GuestAutoLoginGuard implements CanActivate {
  //

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> {
    const guestId = route.paramMap.get('id');
    const isIn = this.authService.isLoggedIn();
    const trueResult = () => true;
    const falseResult = () => false;

    logger.guard(
      'GuestAutoLoginGuard - login id:',
      guestId,
      '| navigated:',
      this.router.navigated
    );

    if (guestId == null) {
      if (isIn) {
        return this.authService.logout().then(trueResult, trueResult);
      } else {
        return true;
      }

      // return this.authService
      //   .getGuest()
      //   .map(guest => guest != null)
      //   .doCondition(isIn => isIn === true, isIn => this.authService.logout())
      //   .mapTo(true);
    } else {
      return this.authService.login(guestId).then(falseResult, falseResult);
    }
  }
}
