import '@firebase/firestore';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

import { Guest } from '../models/guest-ao';

@Injectable()
export class DatabaseService {
  get delete() {
    return firebase.firestore.FieldValue.delete();
  }

  constructor(private afs: AngularFirestore) {}

  public updateDoc(docRef: string, content: {}) {
    return this.afs.doc(docRef).update(content);
  }

  public getDoc<T>(docRef: string): Observable<T> {
    let doc: AngularFirestoreDocument<T>;
    doc = this.afs.doc(docRef);

    return doc.valueChanges().catch((err): Observable<T> => {
      console.error('Error getting doc:', docRef, '| error:', err);
      return null;
    });
  }

  // public getGuest(userId: string): Observable<void | Guest> {
  //   let doc: AngularFirestoreDocument<Guest>;

  //   if (userId == null) {
  //     return Observable.of(null);
  //   }

  //   doc = this.afs.doc('guests/' + userId);
  //   return doc
  //     .valueChanges()
  //     .do(guest => console.warn('DatabaseService getGuestById - guest:', guest))
  //     .map(guest => (guest != null ? { id: userId, ...guest } : guest))
  //     .catch(err => [console.error('getGuestById:', err)]);
  // }
}
