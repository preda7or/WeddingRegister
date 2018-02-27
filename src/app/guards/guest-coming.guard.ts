import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { logger } from '../misc/console-logging';
import { AuthService } from '../services/auth.service';
import { RedirectingService } from '../services/redirecting.service';

@Injectable()
export class GuestComingGuard implements CanActivate {
  constructor(
    private redirect: RedirectingService,
    private authService: AuthService
  ) {}

  private _actOnComingState(
    coming: boolean | undefined,
    options: { [key: string]: string | boolean }
  ): boolean | Promise<boolean> {
    const guestComing = String(coming);
    const action: undefined | boolean | string = options[guestComing];
    const trueResult = () => {
      console.groupEnd();
      return true;
    };

    console.group('GuestComingGuard');
    logger.guard(` - guest coming: ${guestComing} | action: ${action}`);

    if (typeof action === 'string') {
      // return this.redirect.to(action);
      this.redirect.to(action);
      console.groupEnd();
      return false;
    }

    console.groupEnd();
    return !!action;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> {
    const config = route.data.coming;

    // return this.authService
    //   .getGuest()
    //   .map(guest => this._actOnComingState(guest, config));

    const coming = this.authService.isComing();
    return this._actOnComingState(coming, config);
  }
}
