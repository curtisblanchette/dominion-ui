import { animate, style, transition, trigger, state } from '@angular/animations';

export const menuAnimation = trigger('menu-slider', [
  state('false', style({height: 'auto'})),
  state('true', style({height: '55px'})),
  transition( 'false => true',[
    style({height: '*'}),
    animate('250ms ease-out', style({height: 55}))
  ]),
  transition('true => false', [
    style({height: 55}),
    animate('250ms ease-out', style({height: '*'}))
  ])
]);

export const arrowAnimation = trigger('arrow-slider', [
  state('false', style({transform: 'rotate(0deg)'})),
  state('true', style({transform: 'rotate(-90deg)'})),
  transition( 'true => false',[
    style({transform: 'rotate(90deg)'}),
    animate('250ms', style({transform: 'rotate(0deg)'}))
  ]),
  transition('false => true', [
    style({transform: 'rotate(0deg)'}),
    animate('250ms', style({transform: 'rotate(90deg)'}))
  ])
]);
