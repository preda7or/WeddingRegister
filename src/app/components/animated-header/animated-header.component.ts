import { Component, HostBinding, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { routerOutletStateTrigger } from '../../animations/routerAnimations';

@Component({
  selector: 'header',
  templateUrl: './animated-header.component.html',
  animations: [routerOutletStateTrigger]
})
export class AnimatedHeaderComponent implements OnChanges {
  @Input() outlet: ActivatedRoute;
  @HostBinding('@routerOutletState') animation;

  constructor() {}

  ngOnChanges() {
    this.animation = this.outlet.component ? this.outlet.component['name'] : 'LoginComponent';
  }
}
