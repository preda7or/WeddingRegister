import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { AuthService } from './auth.service';
import * as Rx from 'rxjs/Rx';

export interface SessionData {
  name: string;
}

@Injectable()
export class SessionService {
  //
  constructor(private auth: AuthService, private database: DatabaseService) {}

  isAttending(): Rx.Observable<boolean> {
    return this.get().map(data => data !== undefined);
  }

  get(): Rx.Observable<SessionData> {
    return Rx.Observable.of(undefined);
    // return Rx.Observable.of({
    //   name: 'Teo'
    // });
  }
}
