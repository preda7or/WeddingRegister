import '@firebase/firestore';

import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { Guest } from '../models/guest-ao';

@Injectable()
export class DatabaseService {
  private collection: AngularFirestoreCollection<Guest>;

  constructor(private afs: AngularFirestore) {
    this.collection = this.afs.collection('guests');
  }

  // FIXME: Delete function
  public getGuests(): Observable<Guest[]> {
    return this.collection.valueChanges();
  }

  public getGuestById(docId: string): Observable<Guest> {
    let doc: AngularFirestoreDocument<Guest>;

    doc = this.afs.doc('guests/' + docId);
    return doc
      .valueChanges()
      .do(guest => console.warn('DatabaseService getGuestById - guest:', guest))
      .map(
        guest => (guest != null ? Object.assign(guest, { id: docId }) : guest)
      );
  }

  // public getGuest(guestId: string): Observable<Guest> {
  //   let doc: AngularFirestoreDocument<Guest>;

  //   doc = this.afs.doc('guests/' + guestId);
  //   return doc.valueChanges();
  // }
}
