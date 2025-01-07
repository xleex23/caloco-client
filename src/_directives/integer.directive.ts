import { Directive, HostListener } from "@angular/core";

@Directive({
    selector: '[appInteger]'
})

export class IntegerDirective {
    constructor() { }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        
    }
}