import {
  trigger,
  transition,
  style,
  query,
  animate,
  state
} from '@angular/animations';

export const routerOutletStateTrigger = trigger('routerOutletState', [
  state(
    'LoginComponent',
    style({
      height: '100%'
    })
  ),
  transition('void => LoginComponent', []),
  transition('* => LoginComponent', animate(1000)),
  transition('* <=> *', [
    style({
      height: '100%'
    }),
    animate('500ms ease-out')
  ])
]);
