import { Directive, HostListener } from "@angular/core";

@Directive({
    selector: '[appInteger]'
})

export class IntegerDirective {
    constructor() { }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        return this.safeKey(event) ? true : false;
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        return false;
    }

    safeKey(event: KeyboardEvent): boolean {
        const reg = RegExp('^[0-9]*$', 'g');
        if (event.key === 'Backspace') {
            return true;
        } else if (reg.test(event.key)) {
            return true;
        } else {
            return false;
        }
    }
}