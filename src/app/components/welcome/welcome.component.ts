import { Component, OnInit, Input, Output } from '@angular/core';
import { SessionService, SessionData } from '../../services/session.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styles: []
})
export class WelcomeComponent implements OnInit {
  //
  data: Observable<SessionData>;

  constructor(private session: SessionService) {}

  ngOnInit() {
    this.data = this.session.get();
  }
}
