import 'jquery';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

import { AuthService } from '../../services/auth.service';

interface FormData {
  code: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  //
  private cardElementId = '#login-card';
  private loadingClass = 'fadeInUp';
  private waitingClass = 'zoomOut';
  private failedClass = 'shake';
  private animEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

  // formdata = {
  //   invitationCode: ''
  // };

  loginForm: FormGroup;

  constructor(private auth: AuthService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      code: [null, Validators.required],
    });
    this._hideLoadingAnimation();
    this._entryAnimation();
  }

  private _entryAnimation() {
    $(this.cardElementId).addClass('animated');
    this._addClass(this.loadingClass);
  }

  private _showLoadingAnimation() {
    // this._addClass(this.waitingClass, false);
    $(this.cardElementId)
      .find('.loading-overlay')
      .show();
  }
  private _hideLoadingAnimation() {
    // this._addClass(this.waitingClass, false);
    $(this.cardElementId)
      .find('.loading-overlay')
      .hide();
  }

  private _failedAnimation() {
    this._addClass(this.failedClass);
  }

  private _addClass(classes: string, reset = true) {
    if (reset) {
      $(this.cardElementId)
        .removeClass(this.waitingClass)
        .addClass(classes)
        .one(this.animEnd, { classes }, this._removeClass);
    } else {
      $(this.cardElementId)
        .removeClass(this.waitingClass)
        .addClass(classes);
    }
  }

  private _removeClass(event: { target: any; data: any }) {
    $(event.target).removeClass(event.data.classes);
  }

  onSubmit() {
    // const guestId = this.formdata.invitationCode;
    const formData: FormData = this.loginForm.value;
    const guestId = formData.code;
    this._showLoadingAnimation();

    if (this.loginForm.valid) {
      this.auth
        .login(guestId)
        .then(res => {
          // console.log('login success:', res);
          this._hideLoadingAnimation();
        })
        .catch(err => {
          // console.error('login error:', err);
          this._hideLoadingAnimation();
          this._failedAnimation();
        });
    }

    return false;
  }
}
