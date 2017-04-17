import { Component, Input } from '@angular/core';


@Component({
    selector: 'footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})

export class FooterComponent {
     @Input() miniFooter:boolean = true;
     constructor(){

     }
}
