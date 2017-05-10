import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { RouterModule , Router, NavigationStart } from '@angular/router';

import {Auth} from '../services/auth.service';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['../assets/css/styles.scss','./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent {
    currentRoute: string = "";
    constructor(private router: Router, private auth: Auth) {
        this.router.events
        .subscribe(event => {
            if (event instanceof NavigationStart){
                 this.currentRoute = event.url;
            }
        });
    }
 }