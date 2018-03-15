import {
  Directive,
  Input,
  ElementRef,
  Renderer,
  OnInit,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[appLoginInput]'
})
export class LoginInputDirective implements OnInit {
  @Input() pattern: string;
  // @Input() valid: boolean | undefined;
  @Input() textWrong: string;
  @Input() textSuccess: string;

  constructor(private _elRef: ElementRef, private _renderer: Renderer) {}

  ngOnInit() {
    // Inititalise a new <span> wrong/right elements and render it below the host component.

    const wrongTextContainer = this._createSpanInParent();
    this._setClass(wrongTextContainer, 'inputVal', true);
    this._setClass(wrongTextContainer, 'text-danger', true);
    // const textWrong = this._thisElement.getAttribute('data-error');
    // wrongTextContainer.innerHTML = textWrong ? textWrong : 'wrong';
    wrongTextContainer.innerHTML = this.textWrong;
    this._renderer.setElementStyle(wrongTextContainer, 'visibility', 'hidden');

    const rightTextContainer = this._createSpanInParent();
    this._setClass(rightTextContainer, 'inputVal', true);
    this._setClass(rightTextContainer, 'text-success', true);
    // const textSuccess = this._thisElement.getAttribute('data-success');
    // rightTextContainer.innerHTML = textSuccess ? textSuccess : 'success';
    rightTextContainer.innerHTML = this.textSuccess;
    this._renderer.setElementStyle(rightTextContainer, 'visibility', 'hidden');
    // console.warn(this);
  }

  private _createSpanInParent() {
    return this._renderer.createElement(
      this._thisElement.parentElement,
      'span'
    );
  }

  private get _thisElement() {
    return this._elRef.nativeElement;
  }

  private _setClass(element: any, className: string, on: boolean) {
    this._renderer.setElementClass(element, className, on);
  }

  private _setDanger(on: boolean) {
    this._setClass(this._thisElement, 'counter-danger', on);
  }

  private _setSuccess(on: boolean) {
    this._setClass(this._thisElement, 'counter-success', on);
  }

  @HostListener('blur', ['$event'])
  onBlur() {
    /*/
    if (this.valid === undefined) {
      this._setDanger(false);
      this._setSuccess(false);
    } else if (this.valid) {
      this._setDanger(false);
      this._setSuccess(true);
    } else {
      this._setDanger(true);
      this._setSuccess(false);
    }
    /*/
    if (this.pattern) {
      const re = new RegExp(this.pattern);
      if (this._thisElement.length === 0) {
        this._setDanger(false);
        this._setSuccess(false);
      } else if (this._thisElement.value.match(re)) {
        this._setDanger(false);
        this._setSuccess(true);
      } else  {
        this._setDanger(true);
        this._setSuccess(false);
      }
    }
    /**/
  }
}
