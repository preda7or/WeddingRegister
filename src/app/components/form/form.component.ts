import 'rxjs/add/operator/debounceTime';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { slideInOutTrigger } from '../../animations/elementAnimations';
import { Guest } from '../../models/guest-ao';
import { GuestService } from '../../services/guest.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  animations: [slideInOutTrigger],
})
export class FormComponent implements OnInit, OnDestroy {
  saveState: 'saved' | 'dirty' | 'error' = 'saved';
  uid: string;
  step: number;
  guestForm: FormGroup;
  private guest: Guest;
  private subStepParam: Subscription;
  private subGuest: Subscription;
  private subSaving: Subscription;
  private lastStep = 4;

  constructor(
    private route: ActivatedRoute,
    private gs: GuestService,
    private fb: FormBuilder,
  ) {
    this.subStepParam = this.route.paramMap
      .map(pm => parseInt(pm.get('step'), 10) || 1)
      // .do(step => console.log('step:', step))
      .do(step => this.onChangeStep(step))
      .subscribe();
  }

  private filterObject(obj: {}, filter: {}) {
    return Object.keys(filter).reduce((agg, key) => {
      agg[key] = obj[key];
      return agg;
    }, {});
  }

  private initializeGuest() {
    this.subGuest = this.gs.guest$
      .filter(guest => guest != null)
      .do(guest => {
        this.uid = guest.id;
        const filteredGuest = this.filterObject(guest, this.guestForm.controls);
        this.guestForm.setValue(filteredGuest, { emitEvent: false });
      })
      .subscribe();
  }

  private initializeSaving() {
    this.subSaving = this.guestForm.valueChanges
      .do(guest => {
        this.saveState = 'dirty';
        this.guest = guest;
      })
      .debounceTime(1000)
      .do(guest => this.onFormChange(guest))
      .subscribe();
  }

  ngOnInit() {
    this.guestForm = this.fb.group({
      question0: [],
      question1: [],
      question2: ['', Validators.required],
      question3: [],
      question4: [],
      question5: [],
      question6: [],
    });

    this.initializeGuest();
    this.initializeSaving();
  }

  private onNextStep() {
    if (this.step < this.lastStep) {
      this.onChangeStep(this.step + 1);
    }
  }

  private onChangeStep(step: number) {
    this.step = step;
  }

  forceSave() {
    this.onFormChange(this.guest);
  }

  onFormChange(guest: any) {
    // console.log('form:', guest);
    this.gs
      .updateGuest(this.uid, guest)
      .then(o => (this.saveState = 'saved'), e => (this.saveState = 'error'));
  }

  ngOnDestroy() {
    if (this.subStepParam) {
      this.subStepParam.unsubscribe();
    }
    if (this.subGuest) {
      this.subGuest.unsubscribe();
    }
    if (this.subSaving) {
      this.subSaving.unsubscribe();
    }
  }
}
