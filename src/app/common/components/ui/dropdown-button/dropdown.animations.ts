import { animate, style, transition, trigger, query, sequence, stagger } from '@angular/animations';

export const DropDownButtonAnimation = trigger("dropDownMenu", [
transition(":enter", [
        style({ height: 0, overflow: "hidden" }),
        animate("110ms ease-out", style({ opacity: 1, transform: "none", height : '*'}))
    ]),  
transition(":leave", [
        style({ height: "*", overflow: "hidden" }),
        animate("110ms ease-out", style({ height: 0 }))
    ])
]);