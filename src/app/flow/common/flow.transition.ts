import { animate, style, transition, trigger } from "@angular/animations";

const timing = '250ms';
const easing = 'ease-out';

export const FlowAnimations = [
  trigger('slide', [
    transition(
      "void => prev", // ---> Entering --->
      [
        // In order to maintain a zIndex of 2 throughout the ENTIRE
        // animation (but not after the animation), we have to define it
        // in both the initial and target styles. Unfortunately, this
        // means that we ALSO have to define target values for the rest
        // of the styles, which we wouldn't normally have to.
        style({
          transform: 'translateX(-20%)',
          opacity: 0
        }),
        animate(
          `${timing} ${easing}`,
          style({
            transform: 'translateX(0)',
            opacity: 1
          })
        )
      ]
    ),
    transition(	"prev => void", // ---> Leaving --->
      [
        animate(
          `${timing} ${easing}`,
          style({
            transform: 'translateX(20%)',
            opacity: 0
          })
        )
      ]),
    transition(
      "void => next", // <--- Entering <---
      [
        // In order to maintain a zIndex of 2 throughout the ENTIRE
        // animation (but not after the animation), we have to define it
        // in both the initial and target styles. Unfortunately, this
        // means that we ALSO have to define target values for the rest
        // of the styles, which we wouldn't normally have to.
        style({
          transform: 'translateX(20%)',
          opacity: 0,
        }),
        animate(
          `${timing} ${easing}`,
          style({
            transform: 'translateX(0)',
            opacity: 1,
          })
        )
      ]
    ),
    transition(
      "next => void", // <--- Leaving <---
      [
        animate(
          `${timing} ${easing}`,
          style({
            transform: 'translateX(-20%)',
            opacity: 0
          })
        )
      ]
    )
  ])
];
