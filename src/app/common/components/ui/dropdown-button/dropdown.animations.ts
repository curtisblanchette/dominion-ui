import { animate, style, transition, trigger, query, sequence, stagger } from '@angular/animations';

export const DropDownButtonAnimation = trigger("dropDownMenu", [
transition(":enter", [
        style({ height: 0, overflow: "hidden" }),
        animate("50ms cubic-bezier(0.16, 0.14, 0.21, 0.61)", style({ opacity: 1, transform: "none", height : '*'}))
    ]),
transition(":leave", [
        style({ height: "*", overflow: "hidden" }),
        animate("50ms cubic-bezier(0.16, 0.14, 0.21, 0.61)", style({ height: 0 }))
    ])
]);
