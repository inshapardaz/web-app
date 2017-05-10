import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[ui-toggle]' })
export class UIToggleDirective {
    el : ElementRef;
    constructor(el: ElementRef) { 
        this.el = el;
    }

    @HostListener('click') onClick() {
        var el = $(this.el.nativeElement);
        var target = $(el.data('target'));
        var targetClass = el.data('class');

        target.toggleClass(targetClass);
        var html = $('html');
      
        if (html.hasClass('no-focus')) {
            el.blur();    
        }
    }
}