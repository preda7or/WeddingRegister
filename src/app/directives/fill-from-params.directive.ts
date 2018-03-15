import 'jquery';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/take';

import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  ActivatedRoute,
  ChildActivationEnd,
  ParamMap,
  Router,
} from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: 'input[appFillFromParams]',
})
export class FillFromParamsDirective
  implements OnInit, OnDestroy, AfterViewInit {
  //

  @Input() appFillFromParams: string;
  @Input() delay: number;

  private _valueSub: Subscription;
  private _paramsSub: Subscription;
  private params: any;
  private value$: Observable<string>;

  public change = new EventEmitter();

  private _siblings: Element[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private control: NgControl,
    private renderer: Renderer2,
  ) {
    this.params = new BehaviorSubject(null);
    this.router.events
      .filter(e => e instanceof ChildActivationEnd)
      .map(
        (e: ChildActivationEnd) =>
          (e.snapshot.firstChild && e.snapshot.firstChild.paramMap) ||
          (e.snapshot && e.snapshot.paramMap),
      )
      .subscribe(this.params);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this._getSibling();
    this._activate();
    this._startFillIn();
  }

  private _startFillIn() {
    this._paramsSub = this.params
      .filter(p => p != null)
      .delay(this.delay || 200)
      .do((p: ParamMap) => {
        this.fillInWithValue(p.get(this.appFillFromParams));
      })
      .subscribe();
  }

  private _getSibling() {
    const inputP = this.el.nativeElement.parentNode;
    const inputId = this.el.nativeElement.id;

    this._siblings = [
      inputP.querySelector('label[for="' + inputId + '"]') ||
        inputP.querySelector('label'),
      inputP.querySelector('i') || false,
    ];
  }

  private _activate() {
    for (const el of this._siblings) {
      if (el) {
        this.renderer.addClass(el, 'active');
      }
    }
  }

  private fillInWithValue(value: string, speed = 200) {
    const htmlElement = this.el.nativeElement as HTMLElement;
    // htmlElement.click();

    this.setValue();

    if (typeof value !== 'string' || value.length <= 0) {
      return;
    }

    this.value$ = Observable.interval(speed)
      .take(value.length)
      .scan((acc, i) => '' + acc + value.charAt(i), '');

    this._valueSub = this.value$.subscribe(str => this.setValue(str));
  }

  private setValue(value: string = '') {
    const htmlElement = this.el.nativeElement as HTMLElement;

    $(htmlElement)
      .focus()
      .siblings('label, i')
      .addClass('active');

    this.control.control.setValue(value);
    this.control.control.updateValueAndValidity({ emitEvent: true });
  }

  ngOnDestroy() {
    if (this._paramsSub) {
      this._paramsSub.unsubscribe();
    }
    if (this._valueSub) {
      this._valueSub.unsubscribe();
    }
  }
}
