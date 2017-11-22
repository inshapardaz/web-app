import { Directive, HostListener, ElementRef } from '@angular/core';

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[rtl]' })
export class RightToLeftDirective {
    el: ElementRef;

    constructor(el: ElementRef) {
        this.el = el;
    }
}
