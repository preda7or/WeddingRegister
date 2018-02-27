import 'rxjs/Rx';

import { Injectable, OnDestroy } from '@angular/core';
import { Error, User } from '@firebase/auth-types';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Guest } from '../models/guest-ao';
import { DatabaseService } from './database.service';
import { RedirectingService } from './redirecting.service';
import { Subscription } from 'rxjs/Subscription';
import { SubjectSubscriber } from 'rxjs/Subject';
import { ConnectableObservable } from 'rxjs/Rx';
import { logger } from '../misc/console-logging';
import { LoadingSpinnerService } from './loading-spinner.service';

@Injectable()
export class AuthService implements OnDestroy {
  //
  private user$: Observable<User>;
  private _guest: BehaviorSubject<Guest>;
  private _userSub: Subscription;
  private _guestSub: Subscription;

  public guest$: Observable<Guest>;

  private ctorGuestDataQuery() {
    this._userSub = this.user$
      .do(user => console.log('auth debug - user change:', user && user.uid))
      // .doCondition(user => user != null, this.redirect.toRestrictedDomain)
      .switchMap(
        user =>
          user == null ? Observable.of(null) : this.db.getGuestById(user.uid)
      )
      .do(guest =>
        console.log('auth debug - guest change:', guest && guest.name)
      )
      .subscribe(this._guest);
  }

  private ctorRedirection() {
    this._guestSub = this.guest$
      .do(guest => console.log('auth action - guest changed:', guest))
      .doCondition(guest => guest != null, this.redirect.toRestrictedDomain)
      .subscribe();
  }

  constructor(
    private afa: AngularFireAuth,
    private redirect: RedirectingService,
    private db: DatabaseService,
    private loader: LoadingSpinnerService
  ) {
    this._guest = new BehaviorSubject(null);
    this.guest$ = Observable.from(this._guest);
    this.user$ = afa.authState;

    this.ctorGuestDataQuery();
    this.ctorRedirection();
  }

  public isLoggedIn(): boolean {
    const guest = this._guest.getValue();
    return guest != null;
  }

  public isComing(): boolean | undefined {
    const guest = this._guest.getValue();
    return guest && guest.coming;
  }

  private _waitforGuestChange(user: User): Promise<boolean> {
    console.group('auth/login');

    this.loader.showLoadingOverlay();

    console.log(
      ` - success: ${user.uid} | login state: ${this.isLoggedIn()} | guest:`,
      this._guest.getValue()
    );

    const currentGuest = this._guest.getValue();

    const result = this._guest
      // wait for the next guest to arrive from subject
      .skip(1)
      .take(1)
      .do(guest => {
        console.log(` - guest: ${guest} | login state: ${this.isLoggedIn()}`);
        console.groupEnd();
      })
      .mapTo(true)
      .toPromise();

    if (currentGuest && currentGuest.id === user.uid) {
      // make sure the reemit the guest, even if it is the same
      this._guest.next(currentGuest);
    }

    return result;
  }

  private _firebaseLogin(str: string): Promise<User | Error> {
    if (str == null) {
      return Promise.reject('No login string was provided');
    }
    return this.afa.auth.signInWithEmailAndPassword(`${str}@define.hu`, str);
  }

  private _firebaseLogout(res: boolean) {
    this.redirect.toPublicDomain('user logged out -' + res);
    return res;
  }

  public login(str: string): Promise<boolean> {
    return this._firebaseLogin(str)
      .then((user: User) => {
        return this._waitforGuestChange(user);
      })
      .catch((err: Error) => {
        console.log(`auth/login - auth error: ${err.code}
         ${err.message} | login state: ${this.isLoggedIn()}`);
        return this.logout();
      });
  }

  public logout(): Promise<boolean> {
    // Logout only if user is logged in
    console.log('auth/logout');
    if (this.isLoggedIn()) {
      return this.afa.auth.signOut().then(res => this._firebaseLogout(res));

      // return this.afa.auth.signOut();
    } else {
      return Promise.reject('Cannot logout, was not logged in!');
    }
  }
  ngOnDestroy() {
    this._userSub.unsubscribe();
    this._userSub.unsubscribe();
  }
}
