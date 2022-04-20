import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const bigButtons = trigger('bigButtons', [
  transition(':enter',
    query('fiiz-big-button', [
      style({
        transform: 'translateY(-40px)',
        opacity: 0
      }),
      stagger(50, [
        animate('450ms cubic-bezier(0.16, 0.14, 0.21, 0.61)',
          style({
            transform: 'translateY(0)',
            opacity: 1
          })
        )
      ])
    ], {
      optional: true
    })
  )
]);
