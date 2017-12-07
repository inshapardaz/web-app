import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import * as $ from 'jquery';

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[ui-toggle]' })
export class UIToggleDirective {
    el: ElementRef;
    constructor(el: ElementRef) {
        this.el = el;
    }

    @HostListener('click') onClick() {
        const el = $(this.el.nativeElement);
        const target = $(el.data('target'));
        const targetClass = el.data('class');

        target.toggleClass(targetClass);
        const html = $('html');
        if (html.hasClass('no-focus')) {
            el.blur();
        }
    }
}
