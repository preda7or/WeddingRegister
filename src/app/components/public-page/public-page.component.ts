import { Component, OnInit } from '@angular/core';

import { RedirectingService } from './../../services/redirecting.service';

@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styles: []
})
export class PublicPageComponent implements OnInit {
  constructor(private redirect: RedirectingService) {}

  ngOnInit() {
    // this.redirect.introToLogin('public page was hit');
  }
}
