import { Component, OnInit } from '@angular/core';

import { RedirectingService } from './../../services/redirecting.service';

@Component({
  selector: 'app-authenticated-page',
  templateUrl: './authenticated-page.component.html',
  styles: ['header {height:300px}']
})
export class AuthenticatedPageComponent implements OnInit {
  constructor(private redirect: RedirectingService) {}

  ngOnInit() {
    // this.redirect.introToHello('authenticated page was hit');
  }
}
