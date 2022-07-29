import { animate, style, transition, trigger } from '@angular/animations';

export const FlowTimelineAnimation = trigger("fadeInOut", [
transition(":enter", [
        style({ opacity: 0 }),
        animate("250ms", style({ opacity: 1 }))
    ]),
// transition(":leave", [
//         style({ opacity: 1 }),
//         animate("250ms", style({ opacity: 0 }))
//     ])
]);
