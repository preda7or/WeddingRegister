import { Component } from '@angular/core';
import { Data, RouterOutlet } from '@angular/router';
import { animate, trigger, transition } from '@angular/animations';
import { routerOutletStateTrigger } from './animations/routerAnimations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routerOutletStateTrigger]
})
export class AppComponent {
  data: any;
  constructor() {}

  // processOutlet(outlet: RouterOutlet) {
  //   console.warn('change:', outlet.isActivated);

  // }
}
