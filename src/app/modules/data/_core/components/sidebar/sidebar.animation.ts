import { animate, style, transition, trigger, state, group } from '@angular/animations';

export const menuAnimation = trigger('menu-slider',[
    state("false", style({ height: "55px"}) ),
    state("true", style({ height: "auto" }) ),    
    transition("false => true", [
        style({ height: 55 }),
        animate("0.3s ease-out", style({height : '*'})),
    ]),
    transition("true => false", [
        style({ height: "*"}),
        animate("0.3s ease-out", style({height: 55 }))        
    ]),
]);

export const arrowAnimation = trigger('arrow-slider',[
    state("false", style({ transform : "rotate(90deg)" }) ),
    state("true", style({ transform : "rotate(0deg)" }) ),
    transition("false => true", [
        style({transform : "rotate(90deg)"}),
        animate("0.35s", style({transform : "rotate(0deg)"} ))
    ]),
    transition("true => false", [
        style({transform : "rotate(0deg)"}),
        animate("0.35s", style({transform : "rotate(90deg)"} ))
    ]),
]);