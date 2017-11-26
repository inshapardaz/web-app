import { Directive, HostListener, ElementRef } from '@angular/core';
import * as $ from 'jquery';

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[sidebar-toggle]' })
export class SideBarToggleDirective {
    el: ElementRef;

    constructor(el: ElementRef) {
        this.el = el;
    }

    @HostListener('click') onClick() {
        const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const isWideWindow = windowWidth > 991;

        const el = $(this.el.nativeElement);
        const page  = $('#page-container');
        const action = el.data('action');
        if (action === 'sidebar_mini_toggle') {
            if (isWideWindow) {
                page.toggleClass('sidebar-mini');
            }
        } if (action === 'sidebar_close') {
            if (isWideWindow) {
                page.removeClass('sidebar-o');
            } else {
                page.removeClass('sidebar-o-xs');
            }
        } else {
            if (isWideWindow) {
                page.toggleClass('sidebar-o');
            } else {
                page.toggleClass('sidebar-o-xs');
            }
        }
    }
}
