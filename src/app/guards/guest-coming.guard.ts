import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { GuestService } from '../services/guest.service';
import { RedirectingService } from '../services/redirecting.service';

@Injectable()
export class GuestComingGuard implements CanActivate {
  constructor(private redirect: RedirectingService, private gs: GuestService) {}

  private _actOnComingState(
    coming: boolean | undefined,
    options: { [key: string]: string | boolean },
  ): boolean | Promise<boolean> {
    const guestComing = String(coming);
    const action: undefined | boolean | string = options[guestComing];
    const trueResult = () => true;

    if (typeof action === 'string') {
      switch (action) {
        case 'sosorry':
          this.redirect.toSoSorry('GuestComingGuard');
          break;
        case 'sohappy':
          this.redirect.toSoHappy('GuestComingGuard');
          break;
        default:
          this.redirect.toDecision('GuestComingGuard');
          break;
      }

      return false;
    }

    if (action === undefined) {
      return true;
    }

    return !!action;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const config = route.data.coming;

    const coming = this.gs.isComing();
    return this._actOnComingState(coming, config);
  }
}
