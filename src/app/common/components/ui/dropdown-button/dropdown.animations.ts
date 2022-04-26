import { animate, style, transition, trigger, query, sequence, stagger } from '@angular/animations';

export const DropDownButtonAnimation = trigger("dropDownMenu", [
transition(":enter", [
    style({ height: 0, overflow: "hidden" }),
    query(".fiiz-dropdown-button__items", [
        style({ opacity: 0, transform: "translateY(-50px)" })
    ]),
    sequence([
        animate("200ms", style({ height: "*" })),
        query(".fiiz-dropdown-button__items", [
            stagger(-12, [
                animate("110ms ease-out", style({ opacity: 1, transform: "none" }))
            ])
        ])
    ])
]),  
transition(":leave", [
    style({ height: "*", overflow: "hidden" }),
    query(".fiiz-dropdown-button__items", [style({ opacity: 1, transform: "none" })]),
    sequence([
        query(".fiiz-dropdown-button__items", [
            stagger(12, [
                animate(
                    "110ms ease-out",
                    style({ opacity: 0, transform: "translateY(-50px)" })
                )
            ])
        ]),
        animate("60ms", style({ height: 0 }))
    ])
])
]);