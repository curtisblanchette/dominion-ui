import { animate, group, query, style, transition, trigger } from '@angular/animations';

const duration = '250ms';
const delay = '0ms';
const easing = 'ease-out';

export const FlowTransitions = [
  trigger('slide', [
    transition(':increment', [
      query(':enter, :leave', style({}), {optional: true}),
      group([
        query(':enter', [style({transform: 'translateY(20%)', opacity: 0}), animate(`${duration} ${delay} ${easing}`, style({transform: 'translateY(0%)', opacity: 1}))], {
          optional: true,
        }),
        query(':leave', [style({transform: 'translateY(0%)', opacity: 1}), animate(`${duration} ${delay} ${easing}`, style({transform: 'translateY(-20%)', opacity: 0}))], {
          optional: true,
        }),
      ]),
    ]),
    transition(':decrement', [
      query(':enter, :leave', style({}), {optional: true}),
      group([
        query(':enter', [style({transform: 'translateY(-20%)', opacity: 0}), animate(`${duration} ${delay} ${easing}`, style({transform: 'translateY(0%)', opacity: 1}))], {
          optional: true,
        }),
        query(':leave', [style({transform: 'translateY(0%)', opacity: 1}), animate(`${duration} ${delay} ${easing}`, style({transform: 'translateY(20%)', opacity: 0}))], {
          optional: true,
        }),
      ]),
    ]),
  ])
];
