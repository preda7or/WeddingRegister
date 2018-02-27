import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import 'jquery';
import * as $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //
  private cardElementId = '#login-card';
  private loadingClass = 'fadeInUp';
  private waitingClass = 'zoomOut';
  private failedClass = 'shake';
  private animEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

  formdata = {
    invitationCode: ''
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    $(this.cardElementId).addClass('animated');
    this._addClass(this.loadingClass);
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

  onSubmit(form: NgForm) {
    const guestId = this.formdata.invitationCode;

    this._addClass(this.waitingClass, false);

    if (form.valid) {
      this.authService.login(guestId).catch(err => {
        this._addClass(this.failedClass);
      });
    }

    return false;
  }
}
