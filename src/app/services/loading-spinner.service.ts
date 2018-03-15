import '../misc/observable-case';

import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
// import * as $ from 'jquery';
import 'jquery';
import { Subscription } from 'rxjs/Subscription';

// import { logger } from '../misc/console-logging';

@Injectable()
export class LoadingSpinnerService implements OnDestroy {
  //

  private elementId = '#mainpage-loader';

  private sub: Subscription;
  private state: boolean;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.sub = this.router.events
      .doCondition(
        e => e instanceof NavigationStart,
        () => this.showLoadingOverlay('nav start'),
      )
      .doCondition(
        e => e instanceof NavigationEnd || e instanceof NavigationCancel,
        () => this.hideLoadingOverlay('nav end'),
      )
      .subscribe();
  }

  public showLoadingOverlay(reason?: string) {
    if (this.state) {
      return;
    }

    this.state = true;
    // logger.default('showing spinner -', reason);
    $(this.elementId)
      .stop()
      .show()
      .fadeIn();
  }

  private hideLoadingOverlay(reason?: string) {
    if (!this.state) {
      return;
    }

    this.state = false;
    // logger.default('hiding spinner - ', reason);
    $(this.elementId).fadeOut('slow', () => $(this).hide());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
