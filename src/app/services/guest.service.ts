import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Guest } from '../models/guest-ao';
import { DatabaseService } from './database.service';
import { RedirectingService } from './redirecting.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/mapTo';

@Injectable()
export class GuestService implements OnDestroy {
  private _guestSubject: BehaviorSubject<Guest>;
  // private _guestSubject: Subject<Guest>;
  private _currentGuest: Guest = null;
  private _guestSubscription: Subscription;
  private _redirSubscription: Subscription;

  public guest$: Observable<Guest>;

  constructor(
    private db: DatabaseService,
    private redirect: RedirectingService,
    private afa: AngularFireAuth,
  ) {
    this._guestSubject = new BehaviorSubject(null);
    // this._guestSubject = new Subject();
    this.guest$ = this._guestSubject.asObservable();
    this._setupGuestBuilderOnUserChange();
    this._setupRedirectionOnGuestArrival();
  }

  ngOnDestroy() {
    if (this._guestSubscription) {
      this._guestSubscription.unsubscribe();
    }
    if (this._redirSubscription) {
      this._redirSubscription.unsubscribe();
    }
  }

  private _setupRedirectionOnGuestArrival() {
    this._redirSubscription = this.guest$
      // .do(guest => console.log('guest action - guest changed:', guest))
      .doCondition(
        guest => guest != null,
        guest =>
          this.redirect.toRestrictedDomain(
            `GuestService guest change: ${guest.id} ${guest.coming}`,
          ),
      )
      .subscribe();
  }

  private _setupGuestBuilderOnUserChange() {
    this._guestSubscription = this.afa.authState
      .switchMap(
        user => (user == null ? Observable.of(null) : this.getGuest(user.uid)),
      )
      .do(guest => (this._currentGuest = guest))
      .subscribe(this._guestSubject);
  }

  private sanitizeGuestData(guestData: Guest) {
    const guest = Object.assign({}, guestData);
    delete guest.id;
    return guest;
  }

  private buildDbRef(userId: string) {
    return `guests/${userId}`;
  }

  private injectUserId(userId: string) {
    return (guest: Guest) => {
      return guest == null ? null : { id: userId, ...guest };
    };
  }

  private get currentGuestId() {
    const currentGuest = this._currentGuest;
    return currentGuest == null ? null : currentGuest.id;
  }

  public getGuest(userId: string): Observable<Guest> {
    return this.db
      .getDoc<Guest>(this.buildDbRef(userId))
      .map(this.injectUserId(userId));
  }

  public updateGuest(userId: string, guest: Guest): Promise<void> {
    return this.db.updateDoc(
      this.buildDbRef(userId),
      this.sanitizeGuestData(guest),
    );
  }

  public updateComing(coming: boolean | undefined | null, userId?: string) {
    const guestId = userId == null ? this.currentGuestId : userId;
    if (guestId == null) {
      return;
    }
    const guest = {
      coming: coming == null ? this.db.delete : coming,
    };

    return this.db.updateDoc(this.buildDbRef(guestId), guest);
  }

  public isComing(): boolean | undefined {
    const currentGuest = this._currentGuest;
    return currentGuest && currentGuest.coming;
  }

  public forceGuestChange(userId: string) {
    const currentGuest = this._currentGuest;
    if (currentGuest && currentGuest.id === userId) {
      this._guestSubject.next(currentGuest);
    }
  }
}
