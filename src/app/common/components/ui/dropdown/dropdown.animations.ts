import { animate, style, transition, trigger } from '@angular/animations';

export const DropDownAnimation = trigger("dropDownMenu", [
transition(":enter", [
        style({ height: 0 }),
        animate("75ms cubic-bezier(0.16, 0.14, 0.21, 0.61)", style({ opacity: 1, transform: "none", height: '*'}))
    ]),
transition(":leave", [
        style({ height: "*" }),
        animate("50ms cubic-bezier(0.16, 0.14, 0.21, 0.61)", style({ height: 0, opacity: 0 }))
    ])
]);
