import { animate, style, transition, trigger } from "@angular/animations";

const duration = '250ms';
const delay = '0ms';
const easing = 'ease-out';

export const FlowTransitions = [
  trigger('slide', [
    transition(
      "void => next",
      [
        style({
          transform: 'translateX(+50%)',
          opacity: 0
        }),
        animate(
          `${duration} ${delay} ${easing}`,
          style({
            transform: 'translateX(0)',
            opacity: 1
          })
        )
      ]
    ),
    transition(
      "* => prev",
      [
        style({
          transform: 'translateX(-50%)',
          opacity: 0,
        }),
        animate(
          `${duration} ${delay} ${easing}`,
          style({
            transform: 'translateX(0)',
            opacity: 1,
          })
        )
      ]
    ),

  ])
];
