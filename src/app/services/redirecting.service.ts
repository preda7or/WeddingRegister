import '../misc/observable-case';

import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NextObserver } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { logger } from '../misc/console-logging';

declare type RedirectFunction = (value: any) => Promise<boolean>;
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

  constructor(private router: Router) {
    this.toPublicDomain = this.redirectionFactory(['login']);
    this.toRestrictedDomain = this.redirectionFactory(['in']);
    this.toSoHappy = this.redirectionFactory(['in', 'sohappy']);
    this.toSoSorry = this.redirectionFactory(['in', 'sosorry']);
    this.toDecision = this.redirectionFactory(['in', 'decision']);
  }

  public to(url: string): Promise<boolean> {
    console.group('redirectTo:', url, this.router.url, this.router.navigated);
    if (url === this.router.url) {
      logger.redir(' - url match');
      console.groupEnd();
      return Promise.resolve(false);
    }
    logger.redir(' - redirecting:', url);
    return this.router.navigateByUrl(url).then(res => {
      console.groupEnd();
      return res;
    });
  }

  private redirectionFactory(commands: string[]): RedirectAction {
    const redirectionUrl = '/' + commands.join('/');
    const func: RedirectFunction = (reason = '') => {
      if (this.router.url === redirectionUrl) {
        logger.redir('no redirect:', reason);
        return Promise.reject(
          'No redirection needed, current url matches the target.'
        );
      }

      logger.redir(
        'redirection to:',
        '/' + commands.join('/'),
        '| reason:',
        reason
      );
      return this.router.navigate(commands);
    };
    const redirect: RedirectAction = Object.assign(func, { next: func });
    return redirect;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
