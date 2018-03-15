import { Injectable, OnDestroy } from '@angular/core';
import { Error, User } from '@firebase/auth-types';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { GuestService } from './guest.service';
import { LoadingSpinnerService } from './loading-spinner.service';
import { RedirectingService } from './redirecting.service';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class AuthService implements OnDestroy {
  //
  public isLoggedIn$: Observable<boolean>;
  private _currentUser: User = null;
  private _userSubscription: Subscription;

  constructor(
    private afa: AngularFireAuth,
    private redirect: RedirectingService,
    private gs: GuestService,
    private loader: LoadingSpinnerService,
  ) {
    const user$ = afa.authState;

    this._userSubscription = user$
      .do(user => (this._currentUser = user))
      .subscribe();

    this.isLoggedIn$ = user$.map(user => user != null);
  }

  ngOnDestroy() {
    if (this._userSubscription) {
    }
  }

  private _firebaseLogin(str: string): Promise<User | Error> {
    if (str == null) {
      return Promise.reject('No login string was provided');
    }
    return this.afa.auth.signInWithEmailAndPassword(`${str}@define.hu`, str);
  }

  private _afterLogout(res: boolean) {
    this.redirect.toPublicDomain('user logged out -' + res);
    return res;
  }

  private _firebaseLogout(): Promise<boolean> {
    return this.afa.auth.signOut().then(res => this._afterLogout(res));
  }

  public get isLoggedIn(): boolean {
    return this._currentUser != null;
  }

  public login(str: string): Promise<boolean> {
    return this._firebaseLogin(str)
      .then((user: User) => {
        this.loader.showLoadingOverlay();
        this.gs.forceGuestChange(user.uid);
        return Promise.resolve(true);
      })
      .catch((err: Error) => {
        this.logout();
        return Promise.reject('Login was unseccessful!');
      });
  }

  public logout(): Promise<boolean> {
    // Logout only if user is logged in
    if (this.isLoggedIn) {
      this._currentUser = null;
      return this._firebaseLogout();
    } else {
      return Promise.resolve(false);
    }
  }
}
