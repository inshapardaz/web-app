import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[appear]' }
)
export class AppearDirective {
    el: ElementRef;

    constructor(el: ElementRef) {
        this.el = el;
    }

    AfterViewInit() {
        const html = $('html');
        const windowW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const thisEl: any = $(this.el.nativeElement);
        const targetClass = thisEl.data('class') ? thisEl.data('class') : 'animated fadeIn';
        const offset = thisEl.data('offset') ? thisEl.data('offset') : 0;
        const timeout = (html.hasClass('ie9') || windowW < 992) ? 0 : (thisEl.data('timeout') ? thisEl.data('timeout') : 0);

        thisEl.appear(() => {
            setTimeout(() => {
                thisEl
                    .removeClass('visibility-hidden')
                    .addClass(targetClass);
            }, timeout);
        }, { accY: offset });
    }
}
