import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { RouterModule , Router, NavigationStart } from '@angular/router';

import {AuthService} from '../services/auth.service';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AppComponent {
    currentRoute: string = "";
    constructor(private router: Router, private auth: AuthService) {
        this.router.events
        .subscribe(event => {
            if (event instanceof NavigationStart){
                 this.currentRoute = event.url;
            }
        });
        auth.handleAuthentication();
    }
 }