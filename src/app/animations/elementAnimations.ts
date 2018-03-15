import { trigger, transition, style, animate } from '@angular/animations';

export const slideInOutTrigger = trigger('slideInOut', [
  transition(':enter', [
    style({
      display: 'block',
      overflow: 'hidden',
      height: 0,
      paddingTop: 0,
      paddingBottom: 0
    }),
    animate(
      300,
      style({
        display: 'block',
        overflow: 'hidden',
        height: '*',
        paddingTop: '*',
        paddingBottom: '*'
      })
    )
  ]),
  transition(':leave', [
    style({ display: 'block', overflow: 'hidden' }),
    animate(
      300,
      style({
        display: 'block',
        overflow: 'hidden',
        height: 0,
        paddingTop: 0,
        paddingBottom: 0
      })
    )
  ])
]);
