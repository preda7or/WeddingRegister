import { Injectable, OnDestroy } from '@angular/core';
import { NavigationExtras, Router, UrlSerializer } from '@angular/router';
import { NextObserver } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';

import { logger } from '../misc/console-logging';

declare type RedirectFunction = (reason: any) => Promise<boolean>;
declare type RedirectObserver = NextObserver<boolean>;
declare type RedirectAction = RedirectObserver & RedirectFunction;

@Injectable()
export class RedirectingService implements OnDestroy {
  //

  private sub: Subscription;

  public toPublicDomain: RedirectAction; // () => Promise<boolean>;
  public toRestrictedDomain: RedirectAction; // () => Promise<boolean>;
  public toSoHappy: RedirectAction; // () => Promise<boolean>;
  public toDecision: RedirectAction; // () => Promise<boolean>;
  public toSoSorry: RedirectAction; // () => Promise<boolean>;

  constructor(private router: Router, private urlSerializer: UrlSerializer) {
    this.toPublicDomain = this.redirectionFactory(['login']);
    this.toRestrictedDomain = this.redirectionFactory(['in'], true);
    this.toSoHappy = this.redirectionFactory(['in', 'sohappy']);
    this.toSoSorry = this.redirectionFactory(['in', 'sosorry']);
    this.toDecision = this.redirectionFactory(['in', 'decision']);
  }

  private redirectionFactory(
    commands: any[],
    partialMatch: boolean = false,
  ): RedirectAction {
    const redirectionUrl = this.urlSerializer.serialize(
      this.router.createUrlTree(commands),
    );

    const func: RedirectFunction = (reason: any = '') => {
      if (
        (partialMatch && this.router.url.includes(redirectionUrl)) ||
        this.router.url === redirectionUrl
      ) {
        logger.redir(
          'redir - url match:',
          redirectionUrl,
          '| reason:',
          reason,
          '| partial:',
          partialMatch,
        );
        return Promise.resolve(true);
      }

      logger.redir('redir to:', redirectionUrl, '| reason:', reason);
      return this.router.navigate(commands);
    };
    const redirect: RedirectAction = Object.assign(func, { next: func });
    return redirect;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
