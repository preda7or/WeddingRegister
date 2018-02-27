import { Observable } from 'rxjs/Observable';
import { PartialObserver } from 'rxjs/Observer';

interface DoCaseOption<T> {
  case: (value: T) => boolean;
  handler: Function;
  thisArg?: any;
}

function doCase<T>(
  this: Observable<T>,
  options: DoCaseOption<T>[]
): Observable<T> {
  let option;
  let chain = this;
  for (option of options) {
    chain = chain.do(x => {
      if (option.case(x)) {
        option.handler(x, option.thisArg);
      }
    });
  }
  return chain;
}

function doCondition<T>(
  this: Observable<T>,
  condition: (value: T) => boolean,
  observer: Function | PartialObserver<T>
): Observable<T> {
  return this.do(x => {
    if (!!condition(x)) {
      if (observer instanceof Function) {
        observer(x);
      } else {
        observer.next(x);
      }
    }
  });
}

Observable.prototype.doCase = doCase;
Observable.prototype.doCondition = doCondition;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    doCase: typeof doCase;
    doCondition: typeof doCondition;
  }
}
